import mongoose from "mongoose";
import { APIResponseError } from "../errors/response";
import Links, { type ILinks } from "../models/links";

const generateShortLinkKey = async (size: number = 10): Promise<string> => {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // finding a unique key efficiently
    const result = await Links.aggregate([
        {
            $sample: { size: 1 }, // Get a random document to ensure we're not stuck in a pattern
        },
        {
            $project: {
                _id: 0,
                randomKey: {
                    $function: {
                        body: function (size: number, chars: string) {
                            let result = "";
                            for (let i = 0; i < size; i++) {
                                result += chars.charAt(
                                    Math.floor(Math.random() * chars.length)
                                );
                            }
                            return result;
                        },
                        args: [size, chars],
                        lang: "js",
                    },
                },
            },
        },
        {
            $lookup: {
                from: "links",
                let: { key: "$randomKey" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$shortUrlKey", "$$key"] },
                        },
                    },
                ],
                as: "exists",
            },
        },
        {
            $match: {
                exists: { $size: 0 },
            },
        },
    ]);

    if (result.length !== 0) {
        return result[0].randomKey;
    }

    // If no unique key was found in first try, fallback to manual generation
    let isUnique = false;
    let key = "";
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

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
    name: string;
    tags: string[];
    destinationUrl: string;
    shortUrlKey: string;
    comment: string;
    creatorId: string;
    workspaceId: string;
}): Promise<ILinks> => {
    const newLink = await Links.create(link);
    return newLink;
};

const getLinkById = async (linkId: string): Promise<ILinks> => {
    const link = await Links.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(linkId),
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
                comment: 1,
                tags: 1,
                shortUrlKey: 1,
                creator: {
                    _id: "$creator._id",
                    name: "$creator.name",
                    email: "$creator.email",
                    profilePicture: "$creator.profilePicture",
                },
            },
        },
    ]);

    if (link.length === 0) {
        throw new APIResponseError("Link not found", 404, false);
    }
    return link[0];
};

const getLinkByShortUrlKey = async (shortUrlKey: string): Promise<ILinks> => {
    const link = await Links.findOne({ shortUrlKey });
    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }
    return link;
};

const getLinksByWorkspaceId = async (
    workspaceId: string
): Promise<ILinks[]> => {
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

const updateLink = async (linkId: string, link: ILinks): Promise<ILinks> => {
    const updatedLink = await Links.findByIdAndUpdate(linkId, link, {
        new: true,
    });
    if (!updatedLink) {
        throw new APIResponseError("Link not found", 404, false);
    }
    return updatedLink;
};

const deactivateLink = async (linkId: string): Promise<boolean> => {
    const link = await Links.findByIdAndUpdate(linkId, { isActive: false });
    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }
    return true;
};

const deleteLink = async (linkId: string): Promise<boolean> => {
    const link = await Links.findByIdAndDelete(linkId);
    if (!link) {
        throw new APIResponseError("Link not found", 404, false);
    }
    return true;
};

const linksService = {
    generateShortLinkKey,
    createLink,
    getLinkById,
    getLinkByShortUrlKey,
    getLinksByWorkspaceId,
    updateLink,
    deactivateLink,
    deleteLink,
};

export default linksService;
