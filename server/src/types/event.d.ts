import type mongoose from "mongoose";

export type UserAgentData = {
    userAgent?: string;
    ip: string;
    referer: string;
    browser: string;
    os: string;
    device: string;
    region: string;
};

export interface IEvents extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    linkId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    type: string;
    metadata: UserAgentData;
    createdAt: Date;
}

export interface IEventsService {
    /**
     * @param workspaceId
     * @param linkId
     * @param type
     * @param metadata
     * @returns
     */
    captureEvent: (
        workspaceId: string,
        linkId: string,
        type: string,
        metadata: UserAgentData
    ) => Promise<IEvents>;

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
    getEventsByWorkspaceId: ({
        workspaceId,
        linkId,
        type,
        fetchRange = "24h",
        skip = 0,
        limit = 10,
    }: {
        workspaceId: string;
        linkId?: string;
        type?: string;
        fetchRange?: DaterangeTypes;
        skip?: number;
        limit?: number;
    }) => Promise<IEvents[]>;

    /**
     * populated event
     * @param eventId
     * @returns
     */
    getEventById: (eventId: string) => Promise<any>;

    /**
     * @description useful when deleting link or workspace
     * @description at least one of linkId, type, workspaceId is required
     * @param linkId
     * @param type
     * @param workspaceId
     * @returns
     */
    deleteEventsBy: (d: {
        linkId?: string;
        type?: string;
        workspaceId?: string;
    }) => Promise<void>;
}
