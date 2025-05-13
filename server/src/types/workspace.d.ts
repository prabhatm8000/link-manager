import type mongoose from "mongoose";
import type { ClientSession, UpdateWriteOpResult } from "mongoose";
import type { IUser } from "../models/users";

/**
 * workspace will follow plan of user who created it
 */
export interface IWorkspace extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    name: string;
    description: string;
    // workspace will follow plan of user who created it
    createdBy: mongoose.Types.ObjectId;
    people: mongoose.Types.ObjectId[];
    peopleCount: number;
    isActive: boolean;
     /**
     * check if user is authorized to perform action on workspace
     * @param ws
     * @param userId
     * @param checkAll - if true[default], checks user in people and createdBy, else only in people
     * @returns
     */
     authorized: (
        ws: IWorkspace | mongoose.Types.ObjectId | string,
        userId: string,
        checkAll?: boolean
    ) => Promise<boolean>;
}

export interface IWorkspaceModel extends mongoose.Model<IWorkspace> {
    /**
     * check if user is authorized to perform action on workspace
     * @param ws
     * @param userId
     * @param checkAll - if true[default], checks user in people and createdBy, else only in people
     * @returns
     */
    authorized: (
        ws: IWorkspace | mongoose.Types.ObjectId | string,
        userId: string,
        checkAll?: boolean
    ) => Promise<boolean>;
}

export interface IWorkspaceService {
    /**
     * [user is already authenticated]
     * @param workspace
     * @returns
     */
    createWorkspace: (workspace: {
        name: string;
        description: string;
    }, user: IUser) => Promise<IWorkspace>;

    /**
     * authentication required, [checks userId in people]
     * @param workspaceId
     * @param userId
     * @returns workspace
     */
    getWorkspaceById: (
        workspaceId: string,
        userId: string
    ) => Promise<{
        _id: string;
        name: string;
        description: string;
        createdBy: string;
        isActive: boolean;
        people: string[];
        peopleDetails: Array<
            Pick<IUser, "_id" | "id" | "name" | "email" | "profilePicture">
        >;
        createdByDetails: Pick<
            IUser,
            "_id" | "id" | "name" | "email" | "profilePicture"
        >;
    }>;

    /**
     * authentication required, [checks userId in createdBy]
     * @param userId
     * @returns
     */
    getWorkspaceByCreatorId: (userId: string) => Promise<IWorkspace[]>;

    /**
     * authentication required, [checks userId in people or createdBy]
     * @param userId
     * @returns
     */
    getAllWorkspacesForUser: (
        userId: string
    ) => Promise<
        Array<
            Pick<
                IWorkspace,
                "_id" | "id" | "name" | "description" | "createdBy" | "isActive"
            >
        >
    >;

    /**
     * authentication required, [checks userId in createdBy]
     * @param workspaceId
     * @param createdBy
     * @param data
     * @returns
     */
    updateWorkspace: (
        workspaceId: string,
        createdBy: string,
        data: { name: string; description: string }
    ) => Promise<IWorkspace | null>;

    /**
     * authentication required, [checks userId in createdBy]
     * @param workspaceId
     * @param createdBy
     * @param options - optional, has session
     * @returns
     */
    deleteWorkspace: (
        workspaceId: string,
        createdBy: string,
        options?: {
            session: ClientSession
        }
    ) => Promise<IWorkspace | null>;

    /**
     * authentication not required, [checked at controller level]
     * @param workspaceId
     * @param userId
     * @returns
     */
    addPeople: (
        workspaceId: string,
        userId: string
    ) => Promise<UpdateWriteOpResult>;

    /**
     * authentication required, [checks userId in people]
     * @param workspaceId
     * @param userId
     * @returns
     */
    getPeople: (
        workspaceId: string,
        userId: string
    ) => Promise<
        Array<Pick<IUser, "_id" | "id" | "name" | "email" | "profilePicture">>
    >;

    /**
     * authentication required, [checks userId in createdBy with authorized]
     * @param workspaceId
     * @param peopleId
     * @param userId
     * @returns
     */
    removePeople: (
        workspaceId: string,
        peopleId: string,
        userId: string
    ) => Promise<UpdateWriteOpResult>;

    /**
     * authentication not required, [checked at controller level]
     * @param workspaceId
     * @param senderId
     * @returns
     */
    getInviteData: (
        workspaceId: string,
        senderId: string
    ) => Promise<{
        workspace: {
            _id: string;
            name: string;
            description: string;
            createdBy: string;
            createdByDetails: Pick<
                IUser,
                "_id" | "id" | "name" | "email" | "profilePicture"
            >;
        };
        senderDetails: Pick<
            IUser,
            "_id" | "id" | "name" | "email" | "profilePicture"
        >;
    }>;
}
