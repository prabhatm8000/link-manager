export interface IEventUsage extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    count: number;
    month: Date;
}

export interface IEventUsageService {
    /**
     *
     * @param userId
     * @param all - optional, if true returns all event usage, else returns current month
     */
    getEventUsage(
        userId: string,
        all?: boolean
    ): Promise<IEventUsage | IEventUsage[] | null>;

    /**
     * increments event count for the current month
     * @param userId
     * @param by - optinal, default is 1
     */
    incrementEventCount(userId: string, by?: number = 1): Promise<void>;

    /**
     * 
     * @param userId 
     * @param url 
     * @param metadata 
     * @param trigger
     * @returns 
     */
    handleEventCapture: (
        userId: string,
        url: ILinks,
        trigger: EventTriggerType,
        metadata: UserAgentData
    ) => Promise<void>;
}
