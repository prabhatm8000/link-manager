import mongoose from "mongoose";
import { getQuotaFor } from "../constants/quota";
import EventUsage from "../models/eventUsage";
import Usage from "../models/usage";
import type { EventTriggerType, UserAgentData } from "../types/event";
import type { IEventUsage, IEventUsageService } from "../types/eventUsage";
import type { ILinks } from "../types/link";
import analyticsService from "./analyticsService";
import eventsService from "./eventsService";
import linksService from "./linksService";

const getEventUsage = async (
    userId: string,
    all?: boolean
): Promise<IEventUsage | IEventUsage[] | null> => {
    const query: {
        userId: mongoose.Types.ObjectId;
        month: Date | null;
    } = { userId: new mongoose.Types.ObjectId(userId), month: null };
    let eventUsage: IEventUsage | IEventUsage[] | null = null;

    if (all) {
        eventUsage = await EventUsage.find(query);
    } else {
        query["month"] = new Date();
        query["month"].setDate(1);
        query["month"].setHours(0, 0, 0, 0);
        eventUsage = await EventUsage.findOne(query);
    }
    return eventUsage;
};

const incrementEventCount = async (
    userId: string,
    by: number = 1
): Promise<void> => {
    const date = new Date();
    const month = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-01`;
    const query: {
        userId: mongoose.Types.ObjectId;
        month: Date | null;
    } = { userId: new mongoose.Types.ObjectId(userId), month: new Date(month) };

    await EventUsage.updateOne(
        query,
        { $inc: { count: by } },
        { upsert: true, new: true }
    );
};

const handleEventCapture = async (
    userId: string,
    url: ILinks,
    trigger: EventTriggerType,
    metadata: UserAgentData
) => {
    try {
        const userUsage = await Usage.findOne({
            userId: new mongoose.Types.ObjectId(userId),
        });
        if (!userUsage) {
            throw new Error("userUsage for creator not found");
        }
        const MAX_EVENT_CAPTURE = getQuotaFor("EVENT_CAPTURE", userUsage.subscriptionTier);
        
        // all is false. so, only current month
        const eventUsage = (await getEventUsage(userId)) as IEventUsage;
        if (eventUsage?.count >= MAX_EVENT_CAPTURE) {
            throw new Error("Event capture limit reached!");
        }

        // capturing the event on no messedUpFlag
        // void, i know but we don't care about the result
        // and intentionally not using await
        void Promise.allSettled([
            linksService.incrementClickCount(url._id),
            incrementEventCount(userId),
            eventsService.captureEvent(
                url.workspaceId,
                url._id,
                trigger,
                metadata
            ),
            analyticsService.captureData({
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
    } catch (err) {
        console.error("HandleEvent capture failed:", err);
    }
};

const eventUsageService: IEventUsageService = {
    getEventUsage,
    incrementEventCount,
    handleEventCapture,
};
export default eventUsageService;
