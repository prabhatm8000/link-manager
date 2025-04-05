import type mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    _id: string | mongoose.Types.ObjectId;
    id: string;
    name: string;
    email: string;
    password?: string;
    profilePicture?: string;
    isActive?: boolean;
    lastLogin?: Date;
    workspaceCreatedCount?: number;
    comparePassword(password: string): Promise<boolean>;
}

export interface IUsersService {
    /**
     * 
     * @param email
     * @param password
     * @returns 
     */
    login: (params: {
        email: string;
        password: string;
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
    updateUser: (id: string, data: {
        name?: string;
        email?: string;
        password?: string;
        profilePicture?: string;
    }) => Promise<IUser | undefined>;

    /**
     * authentication required, [id is checked in the auth middleware]
     * @param id 
     * @returns 
     */
    deactivateUser: (id: string) => Promise<IUser | undefined>;
}