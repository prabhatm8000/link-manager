import mongoose, { type ClientSession } from "mongoose";
import envVars from "../constants/envVars";
import { APIResponseError } from "../errors/response";
import Links from "../models/links";
import Workspace from "../models/workspaces";
import type { ILinks, ILinksService, LinkMetadata } from "../types/link";
import type { IWorkspace } from "../types/workspace";
import tagsService from "./tagsService";
import workspacesService from "./workspacesService";

// limits for workspace
const MAX_LINKS = 20;

const generateShortUrlKey = async (size: number = 10): Promise<string> => {
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

const generateUrlWithShortUrlKey = (shortUrlKey: string): string => {
    return `${envVars.SERVER_URL}/${shortUrlKey}`;
};

/**
 * authentication required, [checks userId in workspace]
 * @param link
 * @returns
 */
const createLink = async (link: {
    destinationUrl: string;
    shortUrlKey: string;
    metadata?: LinkMetadata;
    tags?: string[];
    comment?: string;
    expirationTime?: Date;
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
            workspaceId: link.workspaceId,
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

/**
 * authentication required, [checks userId in workspace]
 * @param params
 * @returns
 */
const getOneLinkBy = async ({
    linkId,
    shortUrlKey,
    userId,
    workspaceId,
    session,
}: {
    userId: string;
    linkId?: string;
    shortUrlKey?: string;
    workspaceId: string | IWorkspace;
    session?: ClientSession;
}): Promise<ILinks> => {
    if (!linkId && !shortUrlKey) {
        throw new APIResponseError(
            "Link ID or Short URL key is required",
            400,
            false
        );
    }
    await Workspace.authorized(workspaceId, userId);

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
                    metadata: 1,
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

    if (res.password) {
        res["hasPassword"] = true;
        delete res.password;
    }
    res["shortUrl"] = generateUrlWithShortUrlKey(res.shortUrlKey);
    return res;
};

/**
 * authentication not required, [probably for redirecting :D, don't use anywhere else]
 * @param shortUrlKey
 * @returns
 */
const justTheDestinationUrl = async (
    shortUrlKey: string
): Promise<{
    _id: string;
    destinationUrl: string;
    shortUrl: string;
    password?: string;
    metadata?: LinkMetadata;
}> => {
    const link = await Links.aggregate([
        {
            $match: {
                shortUrlKey: shortUrlKey,
            },
        },
        {
            $project: {
                _id: 1,
                destinationUrl: 1,
                metadata: 1,
                password: 1,
            },
        },
    ]);
    if (link.length === 0) {
        throw new APIResponseError("Link not found", 404, false);
    }
    link[0]["shortUrl"] = generateUrlWithShortUrlKey(shortUrlKey);
    return link[0];
};

/**
 * authentication required, [checks userId in workspace]
 * @param workspaceId
 * @param userId
 * @param q - search query [search in shortUrlKey and tags and creator email or name]
 * @returns
 */
const getLinksByWorkspaceId = async (
    workspaceId: string,
    userId: string,
    q?: string
): Promise<ILinks[]> => {
    await Workspace.authorized(workspaceId, userId);
    const matchStage: any = {};
    if (q) {
        matchStage["$or"] = [
            { shortUrlKey: { $regex: q, $options: "i" } },
            { tags: { $regex: q, $options: "i" } },
            { "creator.email": { $regex: q, $options: "i" } },
            { "creator.name": { $regex: q, $options: "i" } },
        ];
    }

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
            $match: {
                ...matchStage,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
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
                creator: {
                    _id: "$creator._id",
                    name: "$creator.name",
                    email: "$creator.email",
                    profilePicture: "$creator.profilePicture",
                },
            },
        },
    ]);
    links.forEach((link) => {
        if (link.password) {
            link["hasPassword"] = true;
            delete link.password;
        }
        link["shortUrl"] = generateUrlWithShortUrlKey(link.shortUrlKey);
    });
    return links;
};

/**
 * authentication required, [checks userId in workspace]
 * @param linkId
 * @param link
 * @param userId
 * @returns
 */
const updateLink = async (
    linkId: string,
    link: ILinks,
    userId: string
): Promise<ILinks> => {
    const existingLink = await Links.findById(linkId);
    if (!existingLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    await Workspace.authorized(existingLink.workspaceId, userId);
    // no shortUrlKey update
    const updatedLink = await Links.findByIdAndUpdate(
        linkId,
        {
            destinationUrl: link.destinationUrl,
            metadata: link.metadata,
            tags: link.tags,
            comment: link.comment,
            expirationTime: link.expirationTime,
            password: link.password,
            isActive: link.isActive,
        },
        {
            new: true,
        }
    );
    if (!updatedLink) {
        throw new APIResponseError("Link not found", 404, false);
    }

    const populatedLink = await getOneLinkBy({
        linkId: updatedLink._id.toString(),
        userId: updatedLink.creatorId.toString(),
        workspaceId: updatedLink.workspaceId.toString(),
    });
    return populatedLink;
};

/**
 * authentication required, [checks userId in workspace]
 * @param linkId
 * @param userId
 * @returns
 */
const deactivateLink = async (linkId: string, userId: string) => {
    const existingLink = await Links.findById(linkId);
    if (!existingLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    await Workspace.authorized(existingLink.workspaceId, userId);

    const link = await Links.findByIdAndUpdate(linkId, { isActive: false });

    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }

    const populatedLink = await getOneLinkBy({
        linkId: link._id.toString(),
        userId: link.creatorId.toString(),
        workspaceId: link.workspaceId.toString(),
    });
    return populatedLink;
};

/**
 * authentication required, [checks userId in workspace]
 * @param linkId
 * @param userId
 * @param options
 * @returns
 */
const deleteLink = async (
    linkId: string,
    userId: string,
    options?: { session?: ClientSession }
) => {
    const existingLink = await Links.findById(linkId);
    if (!existingLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    await Workspace.authorized(existingLink.workspaceId, userId);

    const link = await Links.findByIdAndDelete(linkId, {
        session: options ? options.session : null,
    });
    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }
    return link;
};

/**
 * authentication required, [checks userId in workspace]
 * @param workspaceId
 * @param userId
 * @param options
 * @returns
 */
const deleteAllLinksByWorkspaceId = async (
    workspaceId: string,
    userId: string,
    options?: { session?: ClientSession }
): Promise<boolean> => {
    await Workspace.authorized(workspaceId, userId);
    const links = await Links.deleteMany(
        { workspaceId: new mongoose.Types.ObjectId(workspaceId) },
        { session: options ? options.session : null }
    );
    return true;
};

const linksService: ILinksService = {
    generateShortUrlKey,
    generateUrlWithShortUrlKey,
    createLink,
    getOneLinkBy,
    getLinksByWorkspaceId,
    justTheDestinationUrl,
    updateLink,
    deactivateLink,
    deleteLink,
    deleteAllLinksByWorkspaceId,
};

export default linksService;
