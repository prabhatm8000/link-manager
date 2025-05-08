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
const quota_1 = require("../constants/quota");
const mongodb_1 = require("../lib/mongodb");
const usage_1 = __importDefault(require("../models/usage"));
const getUsageData = (userId, workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    (0, mongodb_1.validateObjectId)(userId);
    const date = new Date();
    const month = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-01`;
    const usage = yield usage_1.default.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "eventusages",
                let: { userId: "$userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$userId", "$$userId"],
                            },
                        },
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: ["$month", new Date(month)],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            count: 1,
                        },
                    }
                ],
                as: "eventUsage",
            }
        },
        {
            $unwind: {
                path: "$eventUsage",
                preserveNullAndEmptyArrays: true, // won't fail on empty array
            },
        },
        {
            $project: {
                _id: 0,
                subscriptionTier: 1,
                eventCount: { $ifNull: ["$eventUsage.count", 0] },
                linkCount: 1,
                workspaceCount: 1,
            },
        },
    ]);
    if (!(usage === null || usage === void 0 ? void 0 : usage[0]))
        return null;
    const u = usage[0];
    const q = quota_1.QUOTA_LIMITS[u.subscriptionTier];
    const result = {
        subscriptionTier: u.subscriptionTier,
        quota: {
            workspaces: {
                label: "Workspaces",
                used: u.workspaceCount,
                total: q.WORKSPACES,
                per: "account",
            },
            links: {
                label: "Links",
                used: ((_b = (_a = u.linkCount) === null || _a === void 0 ? void 0 : _a.find((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.workspaceId) === null || _a === void 0 ? void 0 : _a.toString()) === workspaceId; })) === null || _b === void 0 ? void 0 : _b.count) || 0,
                total: q.LINKS,
                per: "workspace",
            },
            events: {
                label: "Events",
                used: u.eventCount,
                total: q.EVENT_CAPTURE,
                per: "month",
            },
        }
    };
    return result;
});
const incrementWorkspaceCount = (param, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield usage_1.default.updateOne({ userId: new mongoose_1.default.Types.ObjectId(param.userId) }, { $inc: { workspaceCount: param.by || 1 } }, { session: options === null || options === void 0 ? void 0 : options.session });
});
const incrementLinkCount = (param, options) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield usage_1.default.findOne({
        userId: new mongoose_1.default.Types.ObjectId(param.userId),
        "linkCount.workspaceId": new mongoose_1.default.Types.ObjectId(param.workspaceId),
    });
    if (!result) {
        // if not found, add new one
        yield usage_1.default.updateOne({ userId: new mongoose_1.default.Types.ObjectId(param.userId) }, {
            $push: {
                linkCount: {
                    workspaceId: new mongoose_1.default.Types.ObjectId(param.workspaceId),
                    count: param.by || 1,
                },
            },
        });
    }
    else {
        // if found, increment the count
        yield usage_1.default.updateOne({
            userId: new mongoose_1.default.Types.ObjectId(param.userId),
            "linkCount.workspaceId": new mongoose_1.default.Types.ObjectId(param.workspaceId),
        }, { $inc: { "linkCount.$.count": param.by || 1 } });
    }
});
const updateAll = (param, options) => __awaiter(void 0, void 0, void 0, function* () {
    yield usage_1.default.updateOne({
        userId: new mongoose_1.default.Types.ObjectId(param.userId),
    }, {
        $inc: {
            workspaceCount: param.workspaceCountBy || 0,
            "linkCount.$.count": param.linkCountBy || 0,
        },
    }, { session: options === null || options === void 0 ? void 0 : options.session });
});
const usageService = {
    getUsageData,
    incrementWorkspaceCount,
    incrementLinkCount,
    updateAll,
};
exports.default = usageService;
