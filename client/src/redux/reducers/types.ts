type ApiMessageType = string | { title: string; description: string };
export type ApiResponseType = {
    success: boolean;
    message: ApiMessageType;
    data: any;
};

export interface IUser {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    lastLogin?: Date;
    createdAt: string;
    updatedAt: string;
}

export interface IUserState {
    user: IUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    message: ApiMessageType | null;
    isVerificationSent: boolean;
}

export interface IWorkspace {
    _id: string;
    name: string;
    description: string;
    createdBy: string;
    createdByDetails?: IUser;
    people?: string[];
    peopleDetails?: IUser[];
    createdAt: string;
    updatedAt: string;
}

export interface IWorkspaceState {
    workspaces: IWorkspace[];
    currentWorkspace: IWorkspace | null;
    currentWorkspacePeople: IUser[];
    myWorkspaces: IWorkspace[];
    loading: boolean;
    error: string | null;
    message: string | null;
}

export interface ILink {
    _id: string;
    destinationUrl: string;
    shortUrl: string;
    shortUrlKey: string;
    metadata?: {
        title: string;
        description: string;
        favicon: string;
        previewImg: string;
    };
    tags?: string[];
    comment?: string;
    expirationTime?: Date;
    password?: string;
    createdAt: string;

    clickCount?: number;

    status: "active" | "inactive" | "expired";
    workspaceId: string;
    creatorId: string;

    // when populated
    creator?: IUser;
    hasPassword?: boolean;
}

export interface ILinkState {
    links: ILink[];
    loading: boolean;
    deleteLoading: boolean;
    updateLoading: boolean;
    error: string | null;
    message: string | null;
}

export interface LinkDisplayConfig {
    displayMode: "table" | "card";
    heading: "title" | "shortUrl";
    value: "description" | "destinationUrl";
    showAnalytics?: boolean;
    showCreatorAvatar?: boolean;
    showTags?: boolean;
    showCreatedAt?: boolean;
}

export type UserAgentData = {
    userAgent?: string;
    ip: string;
    referer: string;
    browser: string;
    os: string;
    device: string;
    country: string;
    region: string;
    city: string;
};

export type EventTriggerType = "CLICK" | "QR";

export interface IEvent {
    _id: string;
    linkId: string;
    workspaceId: string;
    link: Pick<ILink, "_id" | "shortUrlKey" | "destinationUrl" | "metadata">;
    trigger: EventTriggerType;
    metadata: UserAgentData;
    createdAt: string;
}

export interface IEventState {
    events: IEvent[];
    loading: boolean;
    hasMore: boolean;
    error: string | null;
    message: string | null;
}

export interface INameCount {
    name: string;
    count: number;
}
export interface IAnalytics {
    metrix: {
        totalClicks: number;
        maxClicks: { date: string; count: number };
        minClicks: { date: string; count: number };
        dateWiseClickCount: {
            date: Date;
            count: number;
        }[];
    };
    browser: INameCount[];
    os: INameCount[];
    device: INameCount[];
    country: INameCount[];
    region: INameCount[];
    city: INameCount[];
}
export interface IAnalyticsState {
    analytics: IAnalytics;
    loading: boolean;
    error: string | null;
    message: string | null;
}

export type UsageParameterType = {
    label: string;
    used: number;
    total: number;
    per: string;
};

export interface IUsage {
    subscriptionTier: string;
    quota: {
        workspaces: UsageParameterType;
        links: UsageParameterType;
        events: UsageParameterType;
    };
}

export interface IUsageState {
    loading: boolean;
    error: string | null;
    message: string | null;
    usage: IUsage;
}
