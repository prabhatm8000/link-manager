export interface IRedisService {
    /**
     * get the link json string and parse
     * @param shortUrlKey - string
     * @returns - ILinks | null
     */
    getLinkByShortUrlKey: (shortUrlKey: string) => Promise<ILinks | null>;

    /**
     * stores link:<shortUrlKey> -> JSON.stringify(link)
     * @param shortUrlKey - string
     * @param link - ILinks
     * @returns
     */
    setLinkByShortUrlKey: (shortUrlKey: string, link: ILinks) => Promise<void>;

    /**
     * stores link:<shortUrlKey> -> JSON.stringify(link)
     * @param shortUrlKey - string
     * @param link - ILinks
     * @returns
     */
    deleteLinkByShortUrlKey: (shortUrlKey: string) => Promise<void>;
}
