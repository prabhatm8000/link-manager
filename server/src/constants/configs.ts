import cors from "cors";
import { rateLimit, type RateLimitRequestHandler } from "express-rate-limit";
import envVars from "./envVars";

const CLIENT_URL = envVars.CLIENT_URL;
const originWhitelist = [
    CLIENT_URL,
    "http://localhost:1905",
    "http://localhost:5173",
];
export const shortUrlKeyLength = 7; // 7 characters long


// #region rate limiter
/**
 * @description Strict rate limiter for auth routes.
 * @description 20 requests per 20 minutes for auth routes.
 */
export const authRateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 20 * 60 * 1000, // 20 minutes
    limit: 20, // Limit each IP to 20 requests per `window` (here, per 20 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});

/**
 * @description Rate limiter for all routes.
 * @description 100 requests per 10 minutes for all routes.
 */
export const rateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});
// #endregion


// #region cors
export const corsConfig = cors({
    origin: function (origin, callback) {
        if (!origin || originWhitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Aaaah! Not allowed by CORS"));
        }
    },
    credentials: true,
});
// #endregion

// #region cookies
export const authCookieConfig = {
    authCookieName: "auth-cookie",
    httpOnly: true,
    secure: false,
    sameSite: "strict" as "strict" | "lax" | "none",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};
// #endregion

// invite
export const inviteConfig = {
    expiresAt: 24 * 60 * 60 * 1000, // 1 days
};


// #region redis
export const redisConfig = {
    /**
     * @description Redis cache expiration time
     * 30 mins
     */
    expirationTimeSec: 60 * 30, // 30 mins
}