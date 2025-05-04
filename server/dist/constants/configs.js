"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteConfig = exports.otpConfig = exports.otpCookieConfig = exports.authCookieConfig = exports.corsConfig = exports.rateLimiter = exports.authRateLimiter = exports.jwtConfig = exports.shortUrlKeyLength = void 0;
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const envVars_1 = __importDefault(require("./envVars"));
const CLIENT_URL = envVars_1.default.CLIENT_URL;
const originWhitelist = [
    CLIENT_URL,
    "http://localhost:1905",
    "http://localhost:5173",
];
exports.shortUrlKeyLength = 7; // 7 characters long
// #region jwt
exports.jwtConfig = {
    jwtTokenExpires: 3 * 24 * 60 * 60 * 1000, // 3 days
};
// #endregion
// #region rate limiter
/**
 * @description Strict rate limiter for auth routes.
 * @description 20 requests per 20 minutes for auth routes.
 */
exports.authRateLimiter = (0, express_rate_limit_1.rateLimit)({
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
exports.rateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});
// #endregion
// #region cors
exports.corsConfig = (0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || originWhitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Aaaah! Not allowed by CORS"));
        }
    },
    credentials: true,
});
// #endregion
// #region cookies
exports.authCookieConfig = {
    authCookieName: "auth-cookie",
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};
exports.otpCookieConfig = {
    otpCookieName: "otp-cookie",
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 50 * 60 * 1000, // 5 minutes
};
// #endregion
// otp
exports.otpConfig = {
    size: 6,
    expiresAt: 20 * 60 * 1000, // 20 minutes
};
// invite
exports.inviteConfig = {
    expiresAt: 24 * 60 * 60 * 1000, // 1 days
};
