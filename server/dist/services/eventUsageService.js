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
const eventUsage_1 = __importDefault(require("../models/eventUsage"));
const usage_1 = __importDefault(require("../models/usage"));
const analyticsService_1 = __importDefault(require("./analyticsService"));
const eventsService_1 = __importDefault(require("./eventsService"));
const linksService_1 = __importDefault(require("./linksService"));
const getEventUsage = (userId, all) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { userId: new mongoose_1.default.Types.ObjectId(userId), month: null };
    let eventUsage = null;
    if (all) {
        eventUsage = yield eventUsage_1.default.find(query);
    }
    else {
        query["month"] = new Date();
        query["month"].setDate(1);
        query["month"].setHours(0, 0, 0, 0);
        eventUsage = yield eventUsage_1.default.findOne(query);
    }
    return eventUsage;
});
const incrementEventCount = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, by = 1) {
    const date = new Date();
    const month = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-01`;
    const query = { userId: new mongoose_1.default.Types.ObjectId(userId), month: new Date(month) };
    yield eventUsage_1.default.updateOne(query, { $inc: { count: by } }, { upsert: true, new: true });
});
const handleEventCapture = (userId, url, metadata) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userUsage = yield usage_1.default.findOne({
            userId: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!userUsage) {
            throw new Error("userUsage fot creator not found");
        }
        const MAX_EVENT_CAPTURE = (0, quota_1.getQuotaFor)("EVENT_CAPTURE", userUsage.subscriptionTier);
        // all is false. so, only current month
        const eventUsage = (yield getEventUsage(userId));
        if ((eventUsage === null || eventUsage === void 0 ? void 0 : eventUsage.count) >= MAX_EVENT_CAPTURE) {
            throw new Error("Event capture limit reached!");
        }
        // capturing the event on no messedUpFlag
        // void, i know but we don't care about the result
        // and intentionally not using await
        void Promise.allSettled([
            linksService_1.default.incrementClickCount(url._id),
            incrementEventCount(userId),
            eventsService_1.default.captureEvent(url.workspaceId, url._id, "CLICK", metadata),
            analyticsService_1.default.captureData({
                workspaceId: url.workspaceId,
                linkId: url._id,
                metadata,
            }),
        ]).then((results) => {
            results.forEach((res, i) => {
                if (res.status === "rejected") {
                    console.error(`HandleEvent task ${i} failed:`, res.reason);
                }
            });
        });
    }
    catch (err) {
        console.error("HandleEvent capture failed:", err);
    }
});
const eventUsageService = {
    getEventUsage,
    incrementEventCount,
    handleEventCapture,
};
exports.default = eventUsageService;
