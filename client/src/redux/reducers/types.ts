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
    team?: string[];
    teamDetails?: IUser[];
    createdAt: string;
    updatedAt: string;
}

export interface IWorkspaceState {
    workspaces: IWorkspace[];
    currentWorkspace: IWorkspace | null;
    currentWorkspaceTeam: IUser[];
    myWorkspaces: IWorkspace[];
    loading: boolean;
    error: string | null;
    message: string | null;
}
