import { redisConfig } from "../constants/configs";
import redisclient from "../lib/redisClient";
import type { ILinks } from "../types/link";
import type { IRedisService } from "../types/redis";

const getKey = (id: string, entity: "link") => {
    return `${entity}:${id}`;
};

// #region link
const getLinkByShortUrlKey = async (shortUrlKey: string) => {
    if (!redisclient.isOpen || !redisclient.isReady) return null;
    const key = getKey(shortUrlKey, "link");
    const link = await redisclient.get(key);
    const jsonLink = link ? JSON.parse(link) : null;
    return jsonLink as ILinks | null;
};

const setLinkByShortUrlKey = async (shortUrlKey: string, link: ILinks) => {
    if (!redisclient.isOpen || !redisclient.isReady) return;
    const key = getKey(shortUrlKey, "link");
    await redisclient.set(key, JSON.stringify(link), {
        EX: redisConfig.expirationTimeSec,
    });
};

const deleteLinkByShortUrlKey = async (shortUrlKey: string) => {
    if (!redisclient.isOpen || !redisclient.isReady) return;
    const key = getKey(shortUrlKey, "link");
    await redisclient.del(key);
};
// #endregion

const redisService: IRedisService = {
    getLinkByShortUrlKey: getLinkByShortUrlKey,
    setLinkByShortUrlKey: setLinkByShortUrlKey,
    deleteLinkByShortUrlKey: deleteLinkByShortUrlKey,
};
export default redisService;
