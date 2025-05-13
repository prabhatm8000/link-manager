import mongoose from "mongoose";
import { QUOTA_LIMITS } from "../constants/quota";
import { validateObjectId } from "../lib/mongodb";
import Usage from "../models/usage";
import type { IUsageService } from "../types/usage";

const getUsageData = async (userId: string, workspaceId: string): Promise<any> => {
    validateObjectId(userId);
    const date = new Date();
    const month = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-01`;

    const usage = await Usage.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
                preserveNullAndEmptyArrays: true,   // won't fail on empty array
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

    if (!usage?.[0]) return null;
    const u = usage[0];
    const q = QUOTA_LIMITS[u.subscriptionTier as keyof typeof QUOTA_LIMITS];
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
                used: u.linkCount?.find((item: any) => item?.workspaceId?.toString() === workspaceId)?.count || 0,
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
    }

    return result;
};

const incrementWorkspaceCount = async (
    param: { userId: string; by?: number },
    options?: { session?: mongoose.ClientSession }
): Promise<void> => {
    await Usage.updateOne(
        { userId: new mongoose.Types.ObjectId(param.userId) },
        { $inc: { workspaceCount: param.by || 1 } },
        { session: options?.session }
    );
};

const incrementLinkCount = async (
    param: { userId: string; workspaceId: string; by?: number },
    options?: { session?: mongoose.ClientSession }
): Promise<void> => {
    const result = await Usage.findOne({
        userId: new mongoose.Types.ObjectId(param.userId),
        "linkCount.workspaceId": new mongoose.Types.ObjectId(param.workspaceId),
    });
    
    if (!result) {
        // if not found, add new one
        await Usage.updateOne(
            { userId: new mongoose.Types.ObjectId(param.userId) },
            {
                $push: {
                    linkCount: {
                        workspaceId: new mongoose.Types.ObjectId(
                            param.workspaceId
                        ),
                        count: param.by || 1,
                    },
                },
            }
        );
    } else {
        // if found, increment the count
        await Usage.updateOne(
            {
                userId: new mongoose.Types.ObjectId(param.userId),
                "linkCount.workspaceId": new mongoose.Types.ObjectId(
                    param.workspaceId
                ),
            },
            { $inc: { "linkCount.$.count": param.by || 1 } }
        );
    }
};

const updateAll = async (
    param: {
        userId: string;
        workspaceId: string;
        workspaceCountBy?: number;
        linkCountBy?: number;
    },
    options?: { session?: mongoose.ClientSession }
) => {
    await Usage.updateOne(
        {
            userId: new mongoose.Types.ObjectId(param.userId),
            "linkCount.workspaceId": new mongoose.Types.ObjectId(param.workspaceId)
        },
        {
            $inc: {
                workspaceCount: param.workspaceCountBy || 0,
                "linkCount.$.count": param.linkCountBy || 0,
            },
        },
        { session: options?.session }
    );
};

const usageService: IUsageService = {
    getUsageData,
    incrementWorkspaceCount,
    incrementLinkCount,
    updateAll,
};
export default usageService;
