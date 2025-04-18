export type ApiResponseType = {
    success: boolean;
    message: string;
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
    message: string | null;
    isOtpSent: boolean;
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
    showCreatorAvatar?: boolean;
    showTags?: boolean;
    showCreatedAt?: boolean;
}
