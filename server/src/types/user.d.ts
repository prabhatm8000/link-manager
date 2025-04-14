import type mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    _id: string | mongoose.Types.ObjectId;
    id: string;
    name: string;
    email: string;
    password?: string;
    authType?: "local" | "google";
    profilePicture?: string;
    isActive?: boolean;
    lastLogin?: Date;
    workspaceCreatedCount?: number;
    comparePassword(password: string): Promise<boolean>;
}

export interface IUsersService {
    /**
     * --- local login ---
     * with email and password
     * returns the user, if exists else throws error
     *
     * --- google login ---
     * with credentialFromGoogleAuth
     * returns the user, if exists else creates a new user
     * @param param: {email: string, password: string, credentialFromGoogleAuth: any}
     * @returns
     */
    login: (params: {
        email?: string;
        password?: string;
        credentialFromGoogleAuth?: any;
    }) => Promise<IUser>;

    /**
     *
     * @param: {name: string, email: string, password: string, profilePicture: string}
     * @returns
     */
    createUser: (params: {
        name: string;
        email: string;
        password: string;
        profilePicture?: string;
        authType?: "local" | "google";
    }) => Promise<IUser>;

    /**
     * authentication required, [id is checked in the auth middleware]
     * @param id
     * @returns
     */
    getUserById: (id: string) => Promise<IUser | undefined>;

    /**
     *
     * @param email
     * @returns
     */
    getUserByEmail: (email: string) => Promise<IUser | undefined>;

    /**
     * authentication required, [id is checked in the auth middleware]
     * @param id
     * @param data
     * @returns
     */
    updateUser: (
        id: string,
        data: {
            name?: string;
            email?: string;
            password?: string;
            profilePicture?: string;
        }
    ) => Promise<IUser | undefined>;

    /**
     * authentication required, [id is checked in the auth middleware]
     * @param id
     * @returns
     */
    deactivateUser: (id: string) => Promise<IUser | undefined>;
}
