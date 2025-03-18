import cors from "cors";
import { rateLimit } from "express-rate-limit";
import envVars from "./envVars";

const CLIENT_URL = envVars.CLIENT_URL;

// jwt
export const jwtConfig = {
    jwtTokenExpires: 3 * 24 * 60 * 60 * 1000, // 3 days
};

// rate limiter
export const rateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 200 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});

// cors
export const corsConfig = cors({
    origin: CLIENT_URL,
    credentials: true,
})

// #region cookies
export const authCookieConfig = {
    authCookieName: "auth-cookie",
    httpOnly: true,
    secure: true,
    sameSite: "strict" as "strict" | "lax" | "none",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};

export const otpCookieConfig = {
    otpCookieName: "otp-cookie",
    httpOnly: true,
    secure: true,
    sameSite: "strict" as "strict" | "lax" | "none",
    maxAge: 50 * 60 * 1000, // 5 minutes
};
// #endregion

// otp
export const otpConfig = {
    size: 6,
    expiresAt: 20 * 60 * 1000, // 20 minutes
};

// invite
export const inviteConfig = {
    expiresAt: 24 * 60 * 60 * 1000, // 1 days
};
