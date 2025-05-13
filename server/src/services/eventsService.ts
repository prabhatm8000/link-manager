import mongoose from "mongoose";
import { APIResponseError } from "../errors/response";
import { getDaterange, type DaterangeTypes } from "../lib/dateRange";
import Events from "../models/events";
import type { EventTriggerType, IEvents, IEventsService, UserAgentData } from "../types/event";

/**
 * @param workspaceId
 * @param linkId
 * @param trigger
 * @param metadata
 * @returns
 */
const captureEvent = async (
    workspaceId: string,
    linkId: string,
    trigger: EventTriggerType,
    metadata: UserAgentData
): Promise<IEvents> => {
    const event = new Events({
        workspaceId: new mongoose.Types.ObjectId(workspaceId),
        linkId: new mongoose.Types.ObjectId(linkId),
        trigger,
        metadata,
    });

    await event.save();
    return event;
};

/**
 * link populated
 * @param workspaceId
 * @param linkId
 * @param trigger
 * @param fetchRange - date range for fetching events, it can be "today", "yesterday", "last7days", "last30days", "thismonth", "lastmonth", "all"
 * @param skip - default is 0, you know what it does
 * @param limit - default is 10, you know what it does
 * @returns
 */
const getEventsByWorkspaceId = async ({
    workspaceId,
    linkId,
    trigger,
    fetchRange = "24h",
    skip = 0,
    limit = 10,
}: {
    workspaceId: string;
    linkId?: string;
    trigger?: EventTriggerType;
    fetchRange?: DaterangeTypes;
    skip?: number;
    limit?: number;
}) => {
    const { startDate, endDate } = getDaterange(fetchRange);
    const events = await Events.aggregate([
        {
            $match: {
                workspaceId: new mongoose.Types.ObjectId(workspaceId),
                ...(linkId && { linkId: new mongoose.Types.ObjectId(linkId) }),
                ...(trigger && { trigger }),
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            },
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
                trigger: 1,
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
};

/**
 * populated event
 * @param eventId
 * @returns
 */
const getEventById = async (eventId: string) => {
    const event = await Events.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(eventId),
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
                trigger: 1,
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
    return event?.[0];
};

/**
 * @description useful when deleting link or workspace
 * @description at least one of linkId, type, workspaceId is required
 * @param linkId
 * @param trigger
 * @param workspaceId
 * @returns
 */
const deleteEventsBy = async (
    d: {
        linkId?: string;
        trigger?: string;
        workspaceId?: string;
    },
    options?: {
        session?: mongoose.ClientSession;
    }
): Promise<void> => {
    if (!d.linkId && !d.trigger && !d.workspaceId) {
        throw new APIResponseError(
            "At least one of linkId, trigger, workspaceId is required",
            400,
            false
        );
    }

    await Events.deleteMany(
        {
            ...(d.linkId && { linkId: new mongoose.Types.ObjectId(d.linkId) }),
            ...(d.trigger && { type: d.trigger }),
            ...(d.workspaceId && {
                workspaceId: new mongoose.Types.ObjectId(d.workspaceId),
            }),
        },
        {
            session: options?.session,
        }
    );
};

const eventsService: IEventsService = {
    captureEvent,
    getEventsByWorkspaceId,
    getEventById,
    deleteEventsBy,
};
export default eventsService;
