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
const dateRange_1 = require("../lib/dateRange");
const events_1 = __importDefault(require("../models/events"));
/**
 * @param workspaceId
 * @param linkId
 * @param type
 * @param metadata
 * @returns
 */
const captureEvent = (workspaceId, linkId, type, metadata) => __awaiter(void 0, void 0, void 0, function* () {
    const event = new events_1.default({
        workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId),
        linkId: new mongoose_1.default.Types.ObjectId(linkId),
        type,
        metadata,
    });
    yield event.save();
    return event;
});
/**
 * link populated
 * @param workspaceId
 * @param linkId
 * @param type
 * @param fetchRange - date range for fetching events, it can be "today", "yesterday", "last7days", "last30days", "thismonth", "lastmonth", "all"
 * @param skip - default is 0, you know what it does
 * @param limit - default is 10, you know what it does
 * @returns
 */
const getEventsByWorkspaceId = (_a) => __awaiter(void 0, [_a], void 0, function* ({ workspaceId, linkId, type, fetchRange = "24h", skip = 0, limit = 10, }) {
    const { startDate, endDate } = (0, dateRange_1.getDaterange)(fetchRange);
    const events = yield events_1.default.aggregate([
        {
            $match: Object.assign(Object.assign(Object.assign({ workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId) }, (linkId && { linkId: new mongoose_1.default.Types.ObjectId(linkId) })), (type && { type })), { createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                } }),
        },
        {
            $lookup: {
                from: "links",
                let: { linkId: "$linkId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$linkId"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            shortUrlKey: 1,
                            destinationUrl: 1,
                            metadata: 1,
                        },
                    },
                ],
                as: "link",
            },
        },
        {
            $unwind: "$link",
        },
        {
            $project: {
                _id: 1,
                linkId: "$link._id",
                workspaceId: 1,
                link: "$link",
                type: 1,
                metadata: 1,
                createdAt: 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);
    return events;
});
/**
 * populated event
 * @param eventId
 * @returns
 */
const getEventById = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield events_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(eventId),
            },
        },
        {
            $lookup: {
                from: "workspaces",
                localField: "workspaceId",
                foreignField: "_id",
                as: "workspace",
            },
        },
        {
            $unwind: "$workspace",
        },
        {
            $project: {
                _id: 1,
                linkId: 1,
                type: 1,
                metadata: 1,
                createdAt: 1,
                workspaceId: "$workspace._id",
                workspaceName: "$workspace.name",
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);
    return event === null || event === void 0 ? void 0 : event[0];
});
/**
 * @description useful when deleting link or workspace
 * @description at least one of linkId, type, workspaceId is required
 * @param linkId
 * @param type
 * @param workspaceId
 * @returns
 */
const deleteEventsBy = (d, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!d.linkId && !d.type && !d.workspaceId) {
        throw new response_1.APIResponseError("At least one of linkId, type, workspaceId is required", 400, false);
    }
    yield events_1.default.deleteMany(Object.assign(Object.assign(Object.assign({}, (d.linkId && { linkId: new mongoose_1.default.Types.ObjectId(d.linkId) })), (d.type && { type: d.type })), (d.workspaceId && {
        workspaceId: new mongoose_1.default.Types.ObjectId(d.workspaceId),
    })), {
        session: options === null || options === void 0 ? void 0 : options.session,
    });
});
const eventsService = {
    captureEvent,
    getEventsByWorkspaceId,
    getEventById,
    deleteEventsBy,
};
exports.default = eventsService;
