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
const response_1 = require("../errors/response");
const mongodb_1 = require("../lib/mongodb");
const users_1 = __importDefault(require("../models/users"));
const workspaces_1 = __importDefault(require("../models/workspaces"));
const analyticsService_1 = __importDefault(require("./analyticsService"));
const eventsService_1 = __importDefault(require("./eventsService"));
const linksService_1 = __importDefault(require("./linksService"));
// limits for a user
const MAX_WORKSPACES = 5;
const MAX_PEOPLE = 20;
/**
 * [user is already authenticated]
 * @param workspace
 * @returns
 */
const createWorkspace = (workspace) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = yield users_1.default.findById(workspace.createdBy);
        const workspaceCreatedCount = user === null || user === void 0 ? void 0 : user.workspaceCreatedCount;
        if (!user || workspaceCreatedCount === undefined) {
            throw new response_1.APIResponseError("Something went wrong", 404, false);
        }
        if (workspaceCreatedCount >= MAX_WORKSPACES) {
            throw new response_1.APIResponseError(`A user can only create ${MAX_WORKSPACES} workspaces`, 400, false);
        }
        const newWorkspace = yield workspaces_1.default.create({
            name: workspace.name,
            description: workspace.description,
            createdBy: new mongoose_1.default.Types.ObjectId(workspace.createdBy),
            people: [new mongoose_1.default.Types.ObjectId(workspace.createdBy)],
            $session: session,
        });
        user.workspaceCreatedCount = workspaceCreatedCount + 1;
        yield user.save({ session });
        yield session.commitTransaction();
        return newWorkspace;
    }
    catch (error) {
        yield session.abortTransaction();
        if ((error === null || error === void 0 ? void 0 : error.name) === "MongoServerError" && (error === null || error === void 0 ? void 0 : error.code) === 11000) {
            throw new response_1.APIResponseError("Workspace name already exists", 400, false);
        }
        throw error;
    }
});
/**
 * @param workspaceId
 */
const incrementLinkCount = (workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId);
    const result = yield workspaces_1.default.findByIdAndUpdate(workspaceId, { $inc: { linkCount: 1 } }, { new: true });
    if (!result) {
        throw new response_1.APIResponseError("Workspace not found", 404, false);
    }
});
/**
 * @param workspaceId
 */
const incrementEventCount = (workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId);
    const result = yield workspaces_1.default.findByIdAndUpdate(workspaceId, { $inc: { eventCount: 1 } }, { new: true });
    if (!result) {
        throw new response_1.APIResponseError("Workspace not found", 404, false);
    }
});
const getLinkCount = (workspaceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId, userId);
    const result = yield workspaces_1.default.findById(workspaceId, {
        linkCount: 1,
    });
    result === null || result === void 0 ? void 0 : result.authorized(workspaceId, userId);
    if (!result) {
        throw new response_1.APIResponseError("Workspace not found", 404, false);
    }
    return result.linkCount;
});
const getEventCount = (workspaceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId, userId);
    const result = yield workspaces_1.default.findById(workspaceId, {
        eventCount: 1,
    });
    result === null || result === void 0 ? void 0 : result.authorized(workspaceId, userId);
    if (!result) {
        throw new response_1.APIResponseError("Workspace not found", 404, false);
    }
    return result.eventCount;
});
/**
 * authentication required, [checks userId in people]
 * @param workspaceId
 * @param userId
 * @returns workspace
 */
const getWorkspaceById = (workspaceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workspaces_1.default.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {
                                people: {
                                    $in: [new mongoose_1.default.Types.ObjectId(userId)],
                                },
                            },
                            { createdBy: new mongoose_1.default.Types.ObjectId(userId) },
                        ],
                    },
                    { _id: new mongoose_1.default.Types.ObjectId(workspaceId) },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "people",
                foreignField: "_id",
                as: "peopleDetails",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdByDetails",
            },
        },
        {
            $unwind: "$createdByDetails",
        },
        {
            $project: {
                "peopleDetails.name": 1,
                "peopleDetails.email": 1,
                "peopleDetails._id": 1,
                "peopleDetails.profilePicture": 1,
                "createdByDetails.name": 1,
                "createdByDetails.email": 1,
                "createdByDetails._id": 1,
                "createdByDetails.profilePicture": 1,
                people: 1,
                name: 1,
                description: 1,
                createdBy: 1,
                isActive: 1,
                linkCount: 1,
            },
        },
    ]);
    const workspace = result[0];
    if (!workspace) {
        throw new response_1.APIResponseError("Workspace not found", 404, false);
    }
    return workspace;
});
/**
 * authentication required, [checks userId in createdBy]
 * @param userId
 * @returns
 */
const getWorkspaceByCreatorId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(userId);
    const result = yield workspaces_1.default.find({
        createdBy: new mongoose_1.default.Types.ObjectId(userId),
        isActive: true,
    });
    return result;
});
/**
 * authentication required, [checks userId in people or createdBy]
 * @param userId
 * @returns
 */
const getAllWorkspacesForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(userId);
    const result = yield workspaces_1.default.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {
                                people: {
                                    $in: [new mongoose_1.default.Types.ObjectId(userId)],
                                },
                            },
                            { createdBy: new mongoose_1.default.Types.ObjectId(userId) },
                        ],
                    },
                    { isActive: true },
                ],
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdBy: 1,
                isActive: 1,
            },
        },
    ]);
    return result;
});
/**
 * authentication required, [checks userId in createdBy]
 * @param workspaceId
 * @param createdBy
 * @param data
 * @returns
 */
const updateWorkspace = (workspaceId, createdBy, data) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId);
    return yield workspaces_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(workspaceId), createdBy: createdBy }, { $set: data }, { new: true });
});
/**
 * authentication required, [checks userId in createdBy]
 * @param workspaceId
 * @param createdBy
 * @returns
 */
const deleteWorkspace = (workspaceId, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId, createdBy);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const result = yield workspaces_1.default.findOneAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(workspaceId),
            createdBy: new mongoose_1.default.Types.ObjectId(createdBy),
        }, { session });
        // delete user
        yield users_1.default.findByIdAndUpdate(createdBy, { $inc: { workspaceCreatedCount: -1 } }, { session });
        // delete links
        yield linksService_1.default.deleteAllLinksByWorkspaceId(workspaceId, createdBy, {
            session,
        });
        // delete events
        yield eventsService_1.default.deleteEventsBy({ workspaceId: workspaceId }, { session });
        // delete analytics
        yield analyticsService_1.default.deleteAnalyticsBy({ workspaceId: workspaceId }, { session });
        yield session.commitTransaction();
        if (!result) {
            throw new response_1.APIResponseError("Workspace not found", 404, false);
        }
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        if ((error === null || error === void 0 ? void 0 : error.name) === "MongoServerError" && (error === null || error === void 0 ? void 0 : error.code) === 11000) {
            throw new response_1.APIResponseError("Workspace name already exists", 400, false);
        }
        throw error;
    }
});
/**
 * authentication not required, [checked at controller level]
 * @param workspaceId
 * @param userId
 * @returns
 */
const addPeople = (workspaceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId, userId);
    const workspace = yield workspaces_1.default.findById(workspaceId);
    if (!workspace) {
        throw new response_1.APIResponseError("Workspace not found", 404, false);
    }
    if (workspace.peopleCount >= MAX_PEOPLE) {
        throw new response_1.APIResponseError("Maximum number reached", 400, false);
    }
    const result = yield workspaces_1.default.updateOne({ _id: workspaceId }, {
        $addToSet: { people: new mongoose_1.default.Types.ObjectId(userId) },
        $inc: { peopleCount: 1 },
    });
    return result;
});
/**
 * authentication required, [checks userId in people]
 * @param workspaceId
 * @param userId
 * @returns
 */
const getPeople = (workspaceId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield workspaces_1.default.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {
                                people: {
                                    $in: [new mongoose_1.default.Types.ObjectId(userId)],
                                },
                            },
                            { createdBy: new mongoose_1.default.Types.ObjectId(userId) },
                        ],
                    },
                    { _id: new mongoose_1.default.Types.ObjectId(workspaceId) },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "people",
                foreignField: "_id",
                as: "people",
            },
        },
        {
            $project: {
                "people.name": 1,
                "people.email": 1,
                "people._id": 1,
                "people.profilePicture": 1,
            },
        },
    ]);
    if (!result.length) {
        throw new response_1.APIResponseError("Workspace not found or unauthorized", 404, false);
    }
    return result[0].people;
});
/**
 * authentication required, [checks userId in createdBy with authorized]
 * @param workspaceId
 * @param peopleId
 * @param userId
 * @returns
 */
const removePeople = (workspaceId, peopleId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId, peopleId, userId);
    if ((0, mongodb_1.matchObjectId)(peopleId, userId)) {
        throw new response_1.APIResponseError("You cannot remove yourself", 400, false);
    }
    yield workspaces_1.default.authorized(workspaceId, userId);
    const result = yield workspaces_1.default.updateOne({ _id: workspaceId, createdBy: userId }, {
        $pull: { people: new mongoose_1.default.Types.ObjectId(peopleId) },
        $inc: { peopleCount: -1 },
    });
    if (result.matchedCount === 0) {
        throw new response_1.APIResponseError("Workspace not found", 404, false);
    }
    return result;
});
/**
 * authentication not required, [checked at controller level]
 * @param workspaceId
 * @param senderId
 * @returns
 */
const getInviteData = (workspaceId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    (0, mongodb_1.validateObjectId)(workspaceId);
    (0, mongodb_1.validateObjectId)(senderId);
    const result = yield workspaces_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(workspaceId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdByDetails",
            },
        },
        {
            $unwind: "$createdByDetails",
        },
        {
            $project: {
                "createdByDetails.name": 1,
                "createdByDetails.email": 1,
                "createdByDetails._id": 1,
                "createdByDetails.profilePicture": 1,
                name: 1,
                description: 1,
                createdBy: 1,
            },
        },
    ]);
    const workspace = result[0];
    if (!workspace) {
        throw new response_1.APIResponseError("Workspace not found", 404, false);
    }
    const senderDetails = yield users_1.default.findById(senderId);
    if (!senderDetails) {
        throw new response_1.APIResponseError("User not found", 404, false);
    }
    return {
        workspace,
        senderDetails: {
            _id: senderDetails._id,
            id: senderDetails._id.toString(),
            name: senderDetails.name,
            email: senderDetails.email,
            profilePicture: senderDetails.profilePicture,
        },
    };
});
const workspacesService = {
    createWorkspace,
    incrementLinkCount,
    incrementEventCount,
    getLinkCount,
    getEventCount,
    getWorkspaceById,
    getWorkspaceByCreatorId,
    getAllWorkspacesForUser,
    updateWorkspace,
    deleteWorkspace,
    addPeople,
    getPeople,
    removePeople,
    getInviteData,
};
exports.default = workspacesService;
