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
const analytics_1 = __importDefault(require("../models/analytics"));
const captureData = (d) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date(d.date);
    date.setHours(0, 0, 0, 0); // Set time to midnight to group by date
    const data = {
        _id: new mongoose_1.default.Types.ObjectId(),
        linkId: new mongoose_1.default.Types.ObjectId(d.linkId),
        workspaceId: new mongoose_1.default.Types.ObjectId(d.workspaceId),
        date,
        total: 1,
        browser: [{ name: d.metadata.browser, count: 1 }],
        os: [{ name: d.metadata.os, count: 1 }],
        device: [{ name: d.metadata.device, count: 1 }],
        region: [{ name: d.metadata.region, count: 1 }],
    };
    const analytics = yield analytics_1.default.findOneAndUpdate({
        workspaceId: new mongoose_1.default.Types.ObjectId(d.workspaceId),
        linkId: new mongoose_1.default.Types.ObjectId(d.linkId),
        date: d.date,
    }, data, { upsert: true, new: true }).exec();
    return analytics;
});
const getAnalyticsByDateRange = (d) => __awaiter(void 0, void 0, void 0, function* () {
    const analytics = yield analytics_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({ workspaceId: new mongoose_1.default.Types.ObjectId(d.workspaceId), linkId: new mongoose_1.default.Types.ObjectId(d.linkId) }, (d.startDate && { date: { $gte: d.startDate } })), (d.endDate && { date: { $lte: d.endDate } })),
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$total",
                },
                browser: {
                    $push: { name: "$browser.name", count: "$browser.count" },
                },
                os: {
                    $push: { name: "$os.name", count: "$os.count" },
                },
                device: {
                    $push: { name: "$device.name", count: "$device.count" },
                },
                region: {
                    $push: { name: "$region.name", count: "$region.count" },
                },
            },
        },
        {
            $project: {
                _id: 0,
                total: 1,
                browser: 1,
                os: 1,
                device: 1,
                region: 1,
            },
        },
    ]);
    return analytics[0];
});
const deleteAnalyticsByLinkId = (d) => __awaiter(void 0, void 0, void 0, function* () {
    if (!d.linkId && !d.workspaceId) {
        throw new response_1.APIResponseError("At least one of linkId, workspaceId is required", 400, false);
    }
    yield analytics_1.default.deleteMany({
        linkId: d.linkId,
        workspaceId: d.workspaceId,
    });
});
const analyticsService = {
    captureData,
    getAnalyticsByDateRange,
    deleteAnalyticsByLinkId,
};
exports.default = analyticsService;
