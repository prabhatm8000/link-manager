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
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0); // Set time to midnight to group by date
    const filter = {
        workspaceId: new mongoose_1.default.Types.ObjectId(d.workspaceId),
        linkId: new mongoose_1.default.Types.ObjectId(d.linkId),
        date,
    };
    // 1. getting the array
    // 2. if the array has a object where the name === d.metadata.browser ? increment the count by 1 : create a new object
    // 3. upsert: true, create doc if not exists
    // #region crazy ass capture pipeline
    yield analytics_1.default.updateOne(filter, [
        {
            $set: {
                browser: {
                    $let: {
                        // basically doing, `const exisiting = browser || []`
                        vars: {
                            existing: {
                                $ifNull: ["$browser", []],
                            },
                        },
                        // use the variable inside here
                        in: {
                            $cond: [
                                // basically, if existing.map((b) => b.name).includes(d.metadata.browser)
                                {
                                    $in: [
                                        d.metadata.browser,
                                        {
                                            $map: {
                                                input: "$$existing",
                                                as: "b",
                                                in: "$$b.name",
                                            },
                                        },
                                    ],
                                },
                                // basically, existing.map((b) => b.name === d.metadata.browser ? { ...b, count: b.count + 1 } : b)
                                {
                                    $map: {
                                        input: "$$existing",
                                        as: "b",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$b.name",
                                                        d.metadata.browser,
                                                    ],
                                                },
                                                {
                                                    name: "$$b.name",
                                                    count: {
                                                        $add: [
                                                            "$$b.count",
                                                            1,
                                                        ],
                                                    },
                                                },
                                                "$$b",
                                            ],
                                        },
                                    },
                                },
                                // basically, `existing.concat([{ name: d.metadata.browser, count: 1 }])`
                                {
                                    $concatArrays: [
                                        "$$existing",
                                        [
                                            {
                                                name: d.metadata.browser,
                                                count: 1,
                                            },
                                        ],
                                    ],
                                },
                            ],
                        },
                    },
                },
                os: {
                    $let: {
                        vars: { existing: { $ifNull: ["$os", []] } },
                        in: {
                            $cond: [
                                {
                                    $in: [
                                        d.metadata.os,
                                        {
                                            $map: {
                                                input: "$$existing",
                                                as: "o",
                                                in: "$$o.name",
                                            },
                                        },
                                    ],
                                },
                                {
                                    $map: {
                                        input: "$$existing",
                                        as: "o",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$o.name",
                                                        d.metadata.os,
                                                    ],
                                                },
                                                {
                                                    name: "$$o.name",
                                                    count: {
                                                        $add: [
                                                            "$$o.count",
                                                            1,
                                                        ],
                                                    },
                                                },
                                                "$$o",
                                            ],
                                        },
                                    },
                                },
                                {
                                    $concatArrays: [
                                        "$$existing",
                                        [{ name: d.metadata.os, count: 1 }],
                                    ],
                                },
                            ],
                        },
                    },
                },
                device: {
                    $let: {
                        vars: { existing: { $ifNull: ["$device", []] } },
                        in: {
                            $cond: [
                                {
                                    $in: [
                                        d.metadata.device,
                                        {
                                            $map: {
                                                input: "$$existing",
                                                as: "d",
                                                in: "$$d.name",
                                            },
                                        },
                                    ],
                                },
                                {
                                    $map: {
                                        input: "$$existing",
                                        as: "d",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$d.name",
                                                        d.metadata.device,
                                                    ],
                                                },
                                                {
                                                    name: "$$d.name",
                                                    count: {
                                                        $add: [
                                                            "$$d.count",
                                                            1,
                                                        ],
                                                    },
                                                },
                                                "$$d",
                                            ],
                                        },
                                    },
                                },
                                {
                                    $concatArrays: [
                                        "$$existing",
                                        [
                                            {
                                                name: d.metadata.device,
                                                count: 1,
                                            },
                                        ],
                                    ],
                                },
                            ],
                        },
                    },
                },
                region: {
                    $let: {
                        vars: { existing: { $ifNull: ["$region", []] } },
                        in: {
                            $cond: [
                                {
                                    $in: [
                                        d.metadata.region,
                                        {
                                            $map: {
                                                input: "$$existing",
                                                as: "r",
                                                in: "$$r.name",
                                            },
                                        },
                                    ],
                                },
                                {
                                    $map: {
                                        input: "$$existing",
                                        as: "r",
                                        in: {
                                            $cond: [
                                                {
                                                    $eq: [
                                                        "$$r.name",
                                                        d.metadata.region,
                                                    ],
                                                },
                                                {
                                                    name: "$$r.name",
                                                    count: {
                                                        $add: [
                                                            "$$r.count",
                                                            1,
                                                        ],
                                                    },
                                                },
                                                "$$r",
                                            ],
                                        },
                                    },
                                },
                                {
                                    $concatArrays: [
                                        "$$existing",
                                        [
                                            {
                                                name: d.metadata.region,
                                                count: 1,
                                            },
                                        ],
                                    ],
                                },
                            ],
                        },
                    },
                },
                // basically, `total: (total || 0) + 1`
                total: { $add: [{ $ifNull: ["$total", 0] }, 1] },
            },
        },
    ], { upsert: true });
    // #endregion
    return true;
});
/**
 * @param linkId
 * @param workspaceId
 * @param startDate - optional inclusive
 * @param endDate - optional inclusive
 * @param grouping - optional, default is daily, can be daily, weekly, monthly
 * @returns
 */
const getAnalyticsByDateRange = (d) => __awaiter(void 0, void 0, void 0, function* () {
    const matchStage = {
        $match: Object.assign(Object.assign(Object.assign({ workspaceId: new mongoose_1.default.Types.ObjectId(d.workspaceId), linkId: new mongoose_1.default.Types.ObjectId(d.linkId) }, (d.startDate && !d.endDate && { date: { $gte: d.startDate } })), (d.endDate && !d.startDate && { date: { $lte: d.endDate } })), (d.startDate &&
            d.endDate && {
            date: { $gte: d.startDate, $lte: d.endDate },
        })),
    };
    const dateFormates = {
        daily: "%Y-%m-%d",
        weekly: "%Y-%U", // Week number of year
        monthly: "%Y-%m",
    };
    // for array flattening
    const reduceFunc = (f) => ({
        $reduce: {
            input: f,
            initialValue: [],
            in: {
                $concatArrays: ["$$value", "$$this"],
            },
        },
    });
    // for summing the count of each name in the array
    const reduceThatSumsCount = (f) => ({
        $reduce: {
            input: f,
            initialValue: [],
            in: {
                $let: {
                    vars: {
                        existing: {
                            $filter: {
                                input: "$$value",
                                as: "b",
                                cond: {
                                    $eq: ["$$b.name", "$$this.name"],
                                },
                            },
                        },
                    },
                    in: {
                        $cond: [
                            { $gt: [{ $size: "$$existing" }, 0] },
                            {
                                $map: {
                                    input: "$$value",
                                    as: "b",
                                    in: {
                                        $cond: [
                                            {
                                                $eq: [
                                                    "$$b.name",
                                                    "$$this.name",
                                                ],
                                            },
                                            {
                                                name: "$$b.name",
                                                count: {
                                                    $add: [
                                                        "$$b.count",
                                                        "$$this.count",
                                                    ],
                                                },
                                            },
                                            "$$b",
                                        ],
                                    },
                                },
                            },
                            {
                                $concatArrays: ["$$value", ["$$this"]],
                            },
                        ],
                    },
                },
            },
        },
    });
    const analytics = yield analytics_1.default.aggregate([
        matchStage,
        {
            $project: {
                _id: 0,
                total: 1,
                date: 1,
                browser: 1,
                os: 1,
                device: 1,
                region: 1,
            },
        },
        {
            $addFields: {
                groupDate: {
                    $dateToString: {
                        format: dateFormates[d.grouping || "daily"],
                        date: "$date",
                    },
                },
            },
        },
        {
            $group: {
                _id: "$groupDate",
                total: { $sum: "$total" },
                // push all the arrays in all doc, and creates a nested array
                browser: { $push: "$browser" },
                os: { $push: "$os" },
                device: { $push: "$device" },
                region: { $push: "$region" },
            },
        },
        {
            $project: {
                date: "$_id",
                total: 1,
                // array flatten [[{}], [{}], [{}]] => [{}, {}, {}]
                browser: reduceFunc("$browser"),
                os: reduceFunc("$os"),
                device: reduceFunc("$device"),
                region: reduceFunc("$region"),
            },
        },
        {
            $project: {
                _id: 0,
                date: 1,
                total: 1,
                // summing the count of each name in the array
                browser: reduceThatSumsCount("$browser"),
                os: reduceThatSumsCount("$os"),
                device: reduceThatSumsCount("$device"),
                region: reduceThatSumsCount("$region"),
            },
        },
        {
            $sort: {
                date: 1,
            },
        },
    ]);
    const preparedAnalytics = {
        metrix: {
            totalClicks: 0,
            maxClicks: {
                date: "",
                count: analytics.length > 0 ? Number.MIN_SAFE_INTEGER : 0,
            },
            minClicks: {
                date: "",
                count: analytics.length > 0 ? Number.MAX_SAFE_INTEGER : 0,
            },
            dateWiseClickCount: [],
        },
        browser: new Map(),
        os: new Map(),
        device: new Map(),
        region: new Map(),
    };
    for (const a of analytics) {
        preparedAnalytics.metrix.totalClicks += a.total;
        if (a.total > preparedAnalytics.metrix.maxClicks.count) {
            preparedAnalytics.metrix.maxClicks = {
                date: a.date,
                count: a.total,
            };
        }
        if (a.total < preparedAnalytics.metrix.minClicks.count) {
            preparedAnalytics.metrix.minClicks = {
                date: a.date,
                count: a.total,
            };
        }
        preparedAnalytics.metrix.dateWiseClickCount.push({
            date: a.date,
            count: a.total,
        });
        for (const b of a.browser) {
            preparedAnalytics.browser.set(b.name, b.count + (preparedAnalytics.browser.get(b.name) || 0));
        }
        for (const b of a.os) {
            preparedAnalytics.os.set(b.name, b.count + (preparedAnalytics.os.get(b.name) || 0));
        }
        for (const b of a.device) {
            preparedAnalytics.device.set(b.name, b.count + (preparedAnalytics.device.get(b.name) || 0));
        }
        for (const b of a.region) {
            preparedAnalytics.region.set(b.name, b.count + (preparedAnalytics.region.get(b.name) || 0));
        }
    }
    const analyticsObj = {
        metrix: preparedAnalytics.metrix,
        browser: Array.from(preparedAnalytics.browser).map(([name, count]) => ({
            name,
            count,
        })),
        os: Array.from(preparedAnalytics.os).map(([name, count]) => ({
            name,
            count,
        })),
        device: Array.from(preparedAnalytics.device).map(([name, count]) => ({
            name,
            count,
        })),
        region: Array.from(preparedAnalytics.region).map(([name, count]) => ({
            name,
            count,
        })),
    };
    return analyticsObj;
});
const deleteAnalyticsBy = (d, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!d.linkId && !d.workspaceId) {
        throw new response_1.APIResponseError("At least one of linkId, workspaceId is required", 400, false);
    }
    yield analytics_1.default.deleteMany({
        linkId: d.linkId,
        workspaceId: d.workspaceId,
    }, {
        session: options === null || options === void 0 ? void 0 : options.session,
    });
});
const analyticsService = {
    captureData,
    getAnalyticsByDateRange,
    deleteAnalyticsBy,
};
exports.default = analyticsService;
