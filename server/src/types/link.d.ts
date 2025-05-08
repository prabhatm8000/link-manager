import type { IUser } from "./user";

export interface LinkMetadata {
    title: string;
    description: string;
    favicon: string;
    previewImg: string;
}

export type LinkStatus = "active" | "inactive" | "expired";

/**
 * links and related events will follow plan of workspace
 */
export interface ILinks extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    destinationUrl: string;
    shortUrlKey: string;
    metadata?: LinkMetadata;
    tags?: string[];
    comment?: string;
    expirationTime?: Date;
    password?: string;

    clickCount: number;

    status: LinkStatus;
    workspaceId: mongoose.Types.ObjectId;
    creatorId: mongoose.Types.ObjectId;

    // when populated
    creator?: IUser;
    shortUrl?: string;

    // methods
    comparePassword: (password: string) => Promise<boolean>;
}

export interface ILinksService {
    /**
     *
     * @param size
     * @returns
     */
    generateShortUrlKey: (size?: number) => Promise<string>;

    /**
     * @param shortUrlKey
     * @returns
     */
    generateUrlWithShortUrlKey: (shortUrlKey: string) => string;

    /**
     * authentication required, [checks userId in workspace]
     * @param link
     * @returns
     */
    createLink: (
        link: {
            destinationUrl: string;
            shortUrlKey: string;
            metadata?: LinkMetadata;
            tags?: string[];
            comment?: string;
            expirationTime?: Date;
            password?: string;
            workspaceId: string;
            creatorId: string;
        },
        user: IUser
    ) => Promise<ILinks>;

    /**
     * authentication required, [checks userId in workspace]
     * @param params
     * @returns
     */
    getOneLinkBy: (params: {
        userId: string;
        linkId?: string;
        shortUrlKey?: string;
        workspaceId: string | IWorkspace;
        session?: ClientSession;
    }) => Promise<ILinks>;

    /**
     * authentication required, [checks userId in workspace]
     * @param workspaceId
     * @param userId
     * @param q - search query [search in shortUrlKey and tags and creator email or name]
     * @returns
     */
    getLinksByWorkspaceId: (
        workspaceId: string,
        userId: string,
        q?: string
    ) => Promise<ILinks[]>;

    /**
     * authentication not required, [probably for redirecting :D]
     * @param shortUrlKey
     * @returns
     */
    justTheLink: (shortUrlKey: string) => Promise<ILinks>;

    /**
     * authentication required, [checks userId in workspace]
     * @param linkId
     * @param link
     * @param userId
     * @returns
     */
    updateLink: (
        linkId: string,
        link: ILinks,
        userId: string
    ) => Promise<ILinks>;

    /**
     * on event capture, increment click count
     * @param linkId - linkId to increment click count
     * @returns
     */
    incrementClickCount: (linkId: string) => Promise<void>;

    /**
     * authentication required, [checks userId in workspace]
     * @param linkId
     * @param status
     * @param userId
     * @returns
     */
    changeStatus: (
        linkId: string,
        status: LinkStatus,
        userId: string
    ) => Promise<ILinks>;

    /**
     * authentication required, [checks userId in workspace]
     * @param linkId
     * @param userId
     * @param options
     * @returns
     */
    deleteLink: (
        linkId: string,
        userId: string,
        options?: { session?: ClientSession }
    ) => Promise<ILinks>;

    /**
     * authentication required, [checks userId in workspace]
     * @param workspaceId
     * @param userId
     * @param options
     * @returns - count of deleted items
     */
    deleteAllLinksByWorkspaceId: (
        workspaceId: string,
        userId: string,
        options?: { session?: ClientSession }
    ) => Promise<number>;
}
