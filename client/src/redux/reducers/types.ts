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
    name: string;
    tags: string[];
    destinationUrl: string;
    shortUrlKey: string;
    comment: string;
    workspaceId: string;
    isActive: boolean;
    expiresAt?: Date;
    creator?: IUser;
}

export interface ILinkState {
    links: ILink[];
    loading: boolean;
    error: string | null;
    message: string | null;
}
