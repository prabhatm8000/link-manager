"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const envVars_1 = __importDefault(require("../constants/envVars"));
const response_1 = require("../errors/response");
const links_1 = __importDefault(require("../models/links"));
const workspaces_1 = __importDefault(require("../models/workspaces"));
const tagsService_1 = __importDefault(require("./tagsService"));
const workspacesService_1 = __importDefault(require("./workspacesService"));
// limits for workspace
const MAX_LINKS = 20;
const generateShortUrlKey = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (size = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
        const exists = yield links_1.default.findOne({ shortUrlKey: key });
        isUnique = !exists;
    }
    if (!isUnique) {
        throw new Error("Failed to generate unique key after maximum attempts. Please try again.");
    }
    return key;
});
const generateUrlWithShortUrlKey = (shortUrlKey) => {
    return `${envVars_1.default.SERVER_URL}/${shortUrlKey}`;
};
/**
 * authentication required, [checks userId in workspace]
 * @param link
 * @returns
 */
const createLink = (link) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const workspace = yield workspacesService_1.default.getWorkspaceById(link.workspaceId, link.creatorId);
        if (!workspace) {
            throw new response_1.APIResponseError("Workspace not found", 404, false);
        }
        if (workspace.linkCount >= MAX_LINKS) {
            throw new response_1.APIResponseError("Maximum limit of links reached for this workspace", 400, false);
        }
        const newLink = new links_1.default(link);
        yield newLink.save({ session });
        yield tagsService_1.default.addTags(link.workspaceId, link.tags || []);
        yield workspaces_1.default.findByIdAndUpdate(link.workspaceId, {
            $inc: { linkCounts: 1 },
        }, { session });
        const populatedLink = yield getOneLinkBy({
            linkId: newLink._id.toString(),
            userId: link.creatorId.toString(),
            workspaceId: link.workspaceId,
            session,
        });
        yield session.commitTransaction();
        yield session.endSession();
        return populatedLink;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
});
/**
 * authentication required, [checks userId in workspace]
 * @param params
 * @returns
 */
const getOneLinkBy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ linkId, shortUrlKey, userId, workspaceId, session, }) {
    if (!linkId && !shortUrlKey) {
        throw new response_1.APIResponseError("Link ID or Short URL key is required", 400, false);
    }
    yield workspaces_1.default.authorized(workspaceId, userId);
    const link = yield links_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(linkId),
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
    ], { session });
    if (link.length === 0) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    const res = link[0];
    if (res.password) {
        res["hasPassword"] = true;
        delete res.password;
    }
    res["shortUrl"] = generateUrlWithShortUrlKey(res.shortUrlKey);
    return res;
});
/**
 * authentication not required, [probably for redirecting :D, don't use anywhere else]
 * @param shortUrlKey
 * @returns
 */
const justTheDestinationUrl = (shortUrlKey) => __awaiter(void 0, void 0, void 0, function* () {
    const link = yield links_1.default.aggregate([
        {
            $match: {
                shortUrlKey: shortUrlKey,
            },
        },
        {
            $project: {
                _id: 1,
                destinationUrl: 1,
                password: 1,
            },
        },
    ]);
    if (link.length === 0) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    return link[0];
});
/**
 * authentication required, [checks userId in workspace]
 * @param workspaceId
 * @param userId
 * @param q - search query [search in shortUrlKey and tags and creator email or name]
 * @returns
 */
const getLinksByWorkspaceId = (workspaceId, userId, q) => __awaiter(void 0, void 0, void 0, function* () {
    yield workspaces_1.default.authorized(workspaceId, userId);
    const matchStage = {};
    if (q) {
        matchStage["$or"] = [
            { shortUrlKey: { $regex: q, $options: "i" } },
            { tags: { $regex: q, $options: "i" } },
            { "creator.email": { $regex: q, $options: "i" } },
            { "creator.name": { $regex: q, $options: "i" } },
        ];
    }
    const links = yield links_1.default.aggregate([
        {
            $match: {
                workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId),
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
            $match: Object.assign({}, matchStage),
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
        {
            $sort: {
                createdAt: -1,
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
});
/**
 * authentication required, [checks userId in workspace]
 * @param linkId
 * @param link
 * @param userId
 * @returns
 */
const updateLink = (linkId, link, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLink = yield links_1.default.findById(linkId);
    if (!existingLink) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    yield workspaces_1.default.authorized(existingLink.workspaceId, userId);
    const updatedLink = yield links_1.default.findByIdAndUpdate(linkId, link, {
        new: true,
    });
    if (!updatedLink) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    const populatedLink = yield getOneLinkBy({
        linkId: updatedLink._id.toString(),
        userId: updatedLink.creatorId.toString(),
        workspaceId: updatedLink.workspaceId.toString(),
    });
    return populatedLink;
});
/**
 * authentication required, [checks userId in workspace]
 * @param linkId
 * @param userId
 * @returns
 */
const deactivateLink = (linkId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLink = yield links_1.default.findById(linkId);
    if (!existingLink) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    yield workspaces_1.default.authorized(existingLink.workspaceId, userId);
    const link = yield links_1.default.findByIdAndUpdate(linkId, { isActive: false });
    if (!link) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    const populatedLink = yield getOneLinkBy({
        linkId: link._id.toString(),
        userId: link.creatorId.toString(),
        workspaceId: link.workspaceId.toString(),
    });
    return populatedLink;
});
/**
 * authentication required, [checks userId in workspace]
 * @param linkId
 * @param userId
 * @param options
 * @returns
 */
const deleteLink = (linkId, userId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLink = yield links_1.default.findById(linkId);
    if (!existingLink) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    yield workspaces_1.default.authorized(existingLink.workspaceId, userId);
    const link = yield links_1.default.findByIdAndDelete(linkId, {
        session: options ? options.session : null,
    });
    if (!link) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    return link;
});
/**
 * authentication required, [checks userId in workspace]
 * @param workspaceId
 * @param userId
 * @param options
 * @returns
 */
const deleteAllLinksByWorkspaceId = (workspaceId, userId, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield workspaces_1.default.authorized(workspaceId, userId);
    const links = yield links_1.default.deleteMany({ workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId) }, { session: options ? options.session : null });
    return true;
});
const linksService = {
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
exports.default = linksService;
