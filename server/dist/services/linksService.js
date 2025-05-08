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
const configs_1 = require("../constants/configs");
const envVars_1 = __importDefault(require("../constants/envVars"));
const quota_1 = require("../constants/quota");
const response_1 = require("../errors/response");
const links_1 = __importDefault(require("../models/links"));
const workspaces_1 = __importDefault(require("../models/workspaces"));
const analyticsService_1 = __importDefault(require("./analyticsService"));
const eventsService_1 = __importDefault(require("./eventsService"));
const tagsService_1 = __importDefault(require("./tagsService"));
const usageService_1 = __importDefault(require("./usageService"));
const workspacesService_1 = __importDefault(require("./workspacesService"));
const generateShortUrlKey = () => __awaiter(void 0, void 0, void 0, function* () {
    const size = configs_1.shortUrlKeyLength;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
const createLink = (link, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const workspace = yield workspacesService_1.default.getWorkspaceById(link.workspaceId, link.creatorId);
        if (!workspace) {
            throw new response_1.APIResponseError("Workspace not found", 404, false);
        }
        const MAX_LINKS = (0, quota_1.getQuotaFor)("LINKS", (_a = user.usage) === null || _a === void 0 ? void 0 : _a.subscriptionTier);
        const linkCount = ((_d = (_c = (_b = user.usage) === null || _b === void 0 ? void 0 : _b.linkCount) === null || _c === void 0 ? void 0 : _c.find((item) => item.workspaceId.toString() === link.workspaceId)) === null || _d === void 0 ? void 0 : _d.count) || 0;
        if (linkCount >= MAX_LINKS) {
            throw new response_1.APIResponseError(`Quota limit of ${MAX_LINKS} links reached for this workspace`, 400, false);
        }
        const newLink = new links_1.default(link);
        yield newLink.save({ session });
        yield tagsService_1.default.addTags(link.workspaceId, link.tags || []);
        yield usageService_1.default.incrementLinkCount({ userId: user._id.toString(), workspaceId: workspace._id.toString() }, { session });
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
const justTheLink = (shortUrlKey) => __awaiter(void 0, void 0, void 0, function* () {
    const link = yield links_1.default.findOne({ shortUrlKey });
    if (!link) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    link["shortUrl"] = generateUrlWithShortUrlKey(shortUrlKey);
    return link;
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
    const queryMatchStages = {};
    if (q) {
        queryMatchStages["$or"] = [
            { destinationUrl: { $regex: `${q}`, $options: "i" } },
            { shortUrlKey: { $regex: `${q}`, $options: "i" } },
            { tags: { $regex: `${q}`, $options: "i" } },
            { "creator.email": { $regex: `${q}`, $options: "i" } },
            { "creator.name": { $regex: `${q}`, $options: "i" } },
        ];
    }
    const links = yield links_1.default.aggregate([
        {
            $match: {
                workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId),
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
            $match: Object.assign({}, queryMatchStages),
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
});
/**
 * on event capture, increment click count
 * @param linkId
 * @returns
 */
const incrementClickCount = (linkId) => __awaiter(void 0, void 0, void 0, function* () {
    yield links_1.default.updateOne({ _id: linkId }, { $inc: { clickCount: 1 } });
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
    // no shortUrlKey update
    const updatedLink = yield links_1.default.findByIdAndUpdate(linkId, {
        destinationUrl: link.destinationUrl,
        metadata: link.metadata,
        tags: link.tags,
        comment: link.comment,
        expirationTime: link.expirationTime,
        password: link.password,
        status: link.status,
    }, {
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
 * @param
 * @param userId
 * @returns
 */
const changeStatus = (linkId, status, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingLink = yield links_1.default.findById(linkId);
    if (!existingLink) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    yield workspaces_1.default.authorized(existingLink.workspaceId, userId);
    const link = yield links_1.default.findByIdAndUpdate(linkId, { status }, { new: true });
    if (!link) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    return link;
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
    let session = null;
    if (options) {
        session = options.session;
    }
    else {
        session = yield mongoose_1.default.startSession();
        session.startTransaction();
    }
    const link = yield links_1.default.findByIdAndDelete(linkId, {
        session: options ? options.session : null,
    });
    if (!link) {
        throw new response_1.APIResponseError("Link not found", 404, false);
    }
    // increment link count by -1
    yield usageService_1.default.incrementLinkCount({ userId, workspaceId: link.workspaceId.toString(), by: -1 }, { session });
    // delete events
    yield eventsService_1.default.deleteEventsBy({ linkId: link._id.toString() }, {
        session
    });
    // delete analytics
    yield analyticsService_1.default.deleteAnalyticsBy({ linkId: link._id.toString(), workspaceId: link.workspaceId.toString() }, {
        session
    });
    if (session) {
        yield session.commitTransaction();
        yield session.endSession();
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
    return links.deletedCount;
});
const linksService = {
    generateShortUrlKey,
    generateUrlWithShortUrlKey,
    createLink,
    getOneLinkBy,
    getLinksByWorkspaceId,
    justTheLink,
    incrementClickCount,
    updateLink,
    changeStatus,
    deleteLink,
    deleteAllLinksByWorkspaceId,
};
exports.default = linksService;
