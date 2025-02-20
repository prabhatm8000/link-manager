export type ApiResponseType = {
    success: boolean;
    message: string;
    data: any;
};

export interface IUser {
    id: string;
    name: string;
    email: string;
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
