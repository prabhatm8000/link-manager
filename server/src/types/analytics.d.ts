import type mongoose from "mongoose";
import type { UserAgentData } from "./event";

interface INameCount {
    name: string;
    count: number;
}

export interface IAnalytics extends Document {
    _id: mongoose.Types.ObjectId;
    linkId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    date: Date;
    total: number;
    browser: INameCount[];
    os: INameCount[];
    device: INameCount[];
    region: INameCount[];
}

export interface IAnalyticsService {
    /**
     * 
     * @description this will be called when a link is clicked, to capture the analytics data
     * @param d 
     * @returns - true or throw error if failed
     */
    captureData: (d: {
        linkId: string;
        workspaceId: string;
        metadata: UserAgentData;
    }) => Promise<boolean>;

    /**
     * @param linkId
     * @param workspaceId
     * @param startDate - optional inclusive
     * @param endDate - optional inclusive
     * @param grouping - optional, default is daily, can be daily, weekly, monthly
     * @returns
     */
    getAnalyticsByDateRange: (d: {
        workspaceId: string;
        linkId: string;
        startDate?: Date;
        endDate?: Date;
        grouping?: "daily" | "weekly" | "monthly";
    }) => Promise<any>;

    /**
     * will useful for deleting all the analytics data for a link, when a link or workspace is deleted
     * @description at least one of linkId, workspaceId is required
     * @param workspaceId
     * @param linkId
     * @returns
     */
    deleteAnalyticsByLinkId: (d: {
        linkId?: string;
        workspaceId?: string;
    }) => Promise<void>;
}
