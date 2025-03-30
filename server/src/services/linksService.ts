import mongoose, { type ClientSession } from "mongoose";
import { APIResponseError } from "../errors/response";
import Links, { type ILinks } from "../models/links";
import Workspace from "../models/workspaces";
import tagsService from "./tagsService";
import workspacesService from "./workspacesService";

// limits for workspace
const MAX_LINKS = 20;

const generateShortLinkKey = async (size: number = 10): Promise<string> => {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let isUnique = false;
    let key = "";
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (!isUnique && attempts < MAX_ATTEMPTS) {
        attempts++;
        key = Array(size)
            .fill("")
            .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
            .join("");

        // Check if key exists
        const exists = await Links.findOne({ shortUrlKey: key });
        isUnique = !exists;
    }

    if (!isUnique) {
        throw new Error(
            "Failed to generate unique key after maximum attempts. Please try again."
        );
    }

    return key;
};

const createLink = async (link: {
    destinationUrl: string;
    shortUrlKey: string;
    tags?: string[];
    comment?: string;
    expirationTime?: string[];
    password?: string;

    workspaceId: string;
    creatorId: string;
}): Promise<ILinks> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const workspace = await workspacesService.getWorkspaceById(
            link.workspaceId,
            link.creatorId
        );
        if (!workspace) {
            throw new APIResponseError("Workspace not found", 404, false);
        }
        if (workspace.linkCount >= MAX_LINKS) {
            throw new APIResponseError(
                "Maximum limit of links reached for this workspace",
                400,
                false
            );
        }

        await workspacesService.authorized(workspace, link.creatorId);

        const newLink = new Links(link);

        await newLink.save({ session });
        await tagsService.addTags(link.workspaceId, link.tags || []);
        await Workspace.findByIdAndUpdate(
            link.workspaceId,
            {
                $inc: { linkCounts: 1 },
            },
            { session }
        );

        const populatedLink = await getOneLinkBy({
            linkId: newLink._id.toString(),
            userId: link.creatorId.toString(),
            session,
        });
        await session.commitTransaction();
        await session.endSession();

        return populatedLink;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
};

const getOneLinkBy = async ({
    linkId,
    shortUrlKey,
    userId,
    session,
}: {
    userId: string;
    linkId?: string;
    shortUrlKey?: string;
    session?: ClientSession;
}): Promise<ILinks> => {
    if (!linkId && !shortUrlKey) {
        throw new APIResponseError(
            "Link ID or Short URL key is required",
            400,
            false
        );
    }
    const link = await Links.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(linkId),
                    shortUrlKey: shortUrlKey || { $exists: true },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "creatorId",
                    foreignField: "_id",
                    as: "creator",
                },
            },
            {
                $unwind: "$creator",
            },
            {
                $project: {
                    _id: 1,
                    destinationUrl: 1,
                    shortUrlKey: 1,
                    tags: 1,
                    comment: 1,
                    expirationTime: 1,
                    isActive: 1,
                    password: 1,
                    workspaceId: 1,
                    creator: {
                        _id: "$creator._id",
                        name: "$creator.name",
                        email: "$creator.email",
                        profilePicture: "$creator.profilePicture",
                    },
                },
            },
        ],
        { session }
    );

    if (link.length === 0) {
        throw new APIResponseError("Link not found", 404, false);
    }

    const res = link[0];
    await workspacesService.authorized(res.workspaceId, userId);

    if (res.password) {
        res["hasPassword"] = true;
        delete res.password;
    }
    return res;
};

const getLinksByWorkspaceId = async (
    workspaceId: string,
    userId: string
): Promise<ILinks[]> => {
    await workspacesService.authorized(workspaceId, userId);
    const links = await Links.aggregate([
        {
            $match: {
                workspaceId: new mongoose.Types.ObjectId(workspaceId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "creatorId",
                foreignField: "_id",
                as: "creator",
            },
        },
        {
            $unwind: "$creator",
        },
        {
            $project: {
                _id: 1,
                name: 1,
                destinationUrl: 1,
                shortUrlKey: 1,
                tags: 1,
                comment: 1,
                expirationTime: 1,
                isActive: 1,
                creator: {
                    _id: "$creator._id",
                    name: "$creator.name",
                    email: "$creator.email",
                    profilePicture: "$creator.profilePicture",
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);
    return links;
};

const updateLink = async (
    linkId: string,
    link: ILinks,
    userId: string
): Promise<ILinks> => {
    const existingLink = await Links.findById(linkId);
    if (!existingLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    await workspacesService.authorized(existingLink.workspaceId, userId);
    const updatedLink = await Links.findByIdAndUpdate(linkId, link, {
        new: true,
    });
    if (!updatedLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    
    const populatedLink = await getOneLinkBy({
        linkId: updatedLink._id.toString(),
        userId: updatedLink.creatorId.toString(),
    });
    return populatedLink;
};

const deactivateLink = async (
    linkId: string,
    userId: string
): Promise<boolean> => {
    const existingLink = await Links.findById(linkId);
    if (!existingLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    await workspacesService.authorized(existingLink.workspaceId, userId);

    const link = await Links.findByIdAndUpdate(linkId, { isActive: false });

    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }
    return true;
};

const deleteLink = async (
    linkId: string,
    userId: string,
    options?: { session?: ClientSession }
) => {
    const existingLink = await Links.findById(linkId);
    if (!existingLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    await workspacesService.authorized(existingLink.workspaceId, userId);

    const link = await Links.findByIdAndDelete(linkId, {
        session: options ? options.session : null,
    });
    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }
    return link;
};

const deleteAllLinksByWorkspaceId = async (
    workspaceId: string,
    userId: string,
    options?: { session?: ClientSession }
): Promise<boolean> => {
    await workspacesService.authorized(workspaceId, userId);
    const links = await Links.deleteMany(
        { workspaceId: new mongoose.Types.ObjectId(workspaceId) },
        { session: options ? options.session : null }
    );
    return true;
};

const linksService = {
    generateShortLinkKey,
    createLink,
    getOneLinkBy,
    getLinksByWorkspaceId,
    updateLink,
    deactivateLink,
    deleteLink,
    deleteAllLinksByWorkspaceId,
};

export default linksService;
