/**
 * links and related events will follow plan of workspace
 */
export interface ILinks extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    destinationUrl: string;
    shortUrlKey: string;
    tags?: string[];
    comment?: string;
    expirationTime?: string[];
    password?: string;

    isActive: boolean;
    workspaceId: mongoose.Types.ObjectId;
    creatorId: mongoose.Types.ObjectId;

    // when populated
    creator?: IUser;
    hasPassword?: boolean;

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
    createLink: (link: {
        destinationUrl: string;
        shortUrlKey: string;
        tags?: string[];
        comment?: string;
        expirationTime?: string[];
        password?: string;
        workspaceId: string;
        creatorId: string;
    }) => Promise<ILinks>;

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
    justTheDestinationUrl: (shortUrlKey: string) => Promise<{_id: string, destinationUrl: string, password?: string}>;

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
     * authentication required, [checks userId in workspace]
     * @param linkId
     * @param userId
     * @returns
     */
    deactivateLink: (linkId: string, userId: string) => Promise<ILinks>;

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
     * @returns
     */
    deleteAllLinksByWorkspaceId: (
        workspaceId: string,
        userId: string,
        options?: { session?: ClientSession }
    ) => Promise<boolean>;
}
