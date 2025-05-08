import type mongoose from "mongoose";
import type { SubscriptionTiers } from "../constants/quota";

export interface ILinkCount {
    workspaceId: mongoose.Types.ObjectId;
    count: number;
}

export interface IUsage extends Document {
    _id: mongoose.Types.ObjectId;
    subscriptionTier: SubscriptionTiers;
    userId: mongoose.Types.ObjectId;
    workspaceCount: number;
    linkCount: ILinkCount[];
}

export interface IUsageService {
    /**
     * returns usage data
     * @param userId 
     * @param workspaceId - optional
     */
    getUsageData(userId: string, workspaceId: string): Promise<any>;

    /**
     *
     * @param userId
     * @param by - optional, default is 1
     */
    incrementWorkspaceCount(
        param: { userId: string; by?: number },
        options?: { session?: mongoose.ClientSession }
    ): Promise<void>;

    /**
     *
     * @param userId
     * @param workspaceId
     * @param by - optional, default is 1
     */
    incrementLinkCount(
        param: { userId: string; workspaceId: string; by?: number },
        options?: { session?: mongoose.ClientSession }
    ): Promise<void>;

    /**
     * updates link and workspace count together, 
     * @param param 
     * @param options 
     * @returns 
     */
    updateAll(
        param: {
            userId: string;
            workspaceId: string;
            workspaceCountBy?: number;
            linkCountBy?: number;
        },
        options?: { session?: mongoose.ClientSession }
    ): Promise<void>;
}
