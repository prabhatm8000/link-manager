import mongoose, { type ClientSession } from "mongoose";
import { shortUrlKeyLength } from "../constants/configs";
import envVars from "../constants/envVars";
import { getQuotaFor } from "../constants/quota";
import { APIResponseError } from "../errors/response";
import Links from "../models/links";
import Workspace from "../models/workspaces";
import type {
    ILinks,
    ILinksService,
    LinkMetadata,
    LinkStatus,
} from "../types/link";
import type { IUser } from "../types/user";
import type { IWorkspace } from "../types/workspace";
import analyticsService from "./analyticsService";
import eventsService from "./eventsService";
import redisService from "./redisService";
import tagsService from "./tagsService";
import usageService from "./usageService";
import workspacesService from "./workspacesService";

const generateShortUrlKey = async (): Promise<{ shortUrlKey: string, shortUrl: string }> => {
    const size = shortUrlKeyLength;
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let isUnique = false;
    let key = "";
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (!isUnique && attempts < MAX_ATTEMPTS) {
        attempts++;
        key = Array(size - 1)
            .fill("")
            .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
            .join("");

        key += "1"; // adding a digit, so that it'll be alphanumeric, like always

        // Check if key exists
        const exists = await Links.findOne({ shortUrlKey: key });
        isUnique = !exists;
    }

    if (!isUnique) {
        throw new Error(
            "Failed to generate unique key after maximum attempts. Please try again."
        );
    }

    return {
        shortUrlKey: key,
        shortUrl: generateUrlWithShortUrlKey(key),
    };
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
}, user: IUser): Promise<ILinks> => {
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
        const MAX_LINKS = getQuotaFor("LINKS", user.usage?.subscriptionTier);
        const linkCount = user.usage?.linkCount?.find((item) => item.workspaceId.toString() === link.workspaceId)?.count || 0;
        if (linkCount >= MAX_LINKS) {
            throw new APIResponseError(
                `Quota limit of ${MAX_LINKS} links reached for this workspace`,
                400,
                false
            );
        }

        const newLink = new Links(link);

        await newLink.save({ session });
        await tagsService.addTags(link.workspaceId, link.tags || []);
        await usageService.incrementLinkCount({ userId: user._id.toString(), workspaceId: workspace._id.toString() }, { session });

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
                    status: 1,
                    password: 1,
                    workspaceId: 1,
                    createdAt: 1,
                    clickCount: 1,
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
 * authentication not required, [probably for redirecting :D, don't use anywhere else].
 * If not in redis then db, (store has a expiration of 30mins)
 * @param shortUrlKey
 * @returns
 */
const justTheLink = async (shortUrlKey: string): Promise<ILinks> => {
    const cachedLink = await redisService.getLinkByShortUrlKey(shortUrlKey);
    if (cachedLink !== null) {
        return cachedLink;
    }

    const link = await Links.findOne({ shortUrlKey });
    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }

    const result = {
        ...link?._doc,
        shortUrl: generateUrlWithShortUrlKey(shortUrlKey)
    } 
    void redisService.setLinkByShortUrlKey(shortUrlKey, result);
    return result;
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
    await Workspace.authorized(workspaceId, userId, false);
    const queryMatchStages: any = {};
    if (q) {
        queryMatchStages["$or"] = [
            { destinationUrl: { $regex: `${q}`, $options: "i" } },
            { shortUrlKey: { $regex: `${q}`, $options: "i" } },
            { tags: { $regex: `${q}`, $options: "i" } },
            { "creator.email": { $regex: `${q}`, $options: "i" } },
            { "creator.name": { $regex: `${q}`, $options: "i" } },
        ];
    }

    const links = await Links.aggregate([
        {
            $match: {
                workspaceId: new mongoose.Types.ObjectId(workspaceId),
            },
        },
        {
            $sort: {
                createdAt: -1,
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
                ...queryMatchStages,
            },
        },
        {
            $project: {
                _id: 1,
                workspaceId: 1,
                destinationUrl: 1,
                shortUrlKey: 1,
                tags: 1,
                comment: 1,
                expirationTime: 1,
                status: 1,
                password: 1,
                metadata: 1,
                createdAt: 1,
                clickCount: 1,
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
 * on event capture, increment click count
 * @param linkId
 * @returns
 */
const incrementClickCount = async (linkId: string): Promise<void> => {
    await Links.updateOne({ _id: linkId }, { $inc: { clickCount: 1 } });
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
            status: link.status,
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
 * @param
 * @param userId
 * @returns
 */
const changeStatus = async (
    linkId: string,
    status: LinkStatus,
    userId: string
) => {
    const existingLink = await Links.findById(linkId);
    if (!existingLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    await Workspace.authorized(existingLink.workspaceId, userId);

    const link = await Links.findByIdAndUpdate(
        linkId,
        { status },
        { new: true }
    );

    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }

    return link;
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

    let session = null;
    if (options) {
        session = options.session;
    } else {
        session = await mongoose.startSession();
        session.startTransaction();
    }

    const link = await Links.findByIdAndDelete(linkId, {
        session: options ? options.session : null,
    });
    
    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }

    // increment link count by -1
    await usageService.incrementLinkCount({ userId, workspaceId: link.workspaceId.toString(), by: -1 }, { session });

    // delete events
    await eventsService.deleteEventsBy({ linkId: link._id.toString() }, {
        session
    });
    // delete analytics
    await analyticsService.deleteAnalyticsBy({ linkId: link._id.toString(), workspaceId: link.workspaceId.toString() }, {
        session
    });

    if (session) {
        await session.commitTransaction();
        await session.endSession();
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
): Promise<number> => {
    await Workspace.authorized(workspaceId, userId);
    const links = await Links.deleteMany(
        { workspaceId: new mongoose.Types.ObjectId(workspaceId) },
        { session: options ? options.session : null }
    );
    return links.deletedCount;
};

const linksService: ILinksService = {
    generateShortUrlKey: generateShortUrlKey,
    generateUrlWithShortUrlKey: generateUrlWithShortUrlKey,
    createLink: createLink,
    getOneLinkBy: getOneLinkBy,
    getLinksByWorkspaceId: getLinksByWorkspaceId,
    justTheLink: justTheLink,
    incrementClickCount: incrementClickCount,
    updateLink: updateLink,
    changeStatus: changeStatus,
    deleteLink: deleteLink,
    deleteAllLinksByWorkspaceId: deleteAllLinksByWorkspaceId,
};

export default linksService;
