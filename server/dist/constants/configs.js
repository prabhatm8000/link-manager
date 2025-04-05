"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteConfig = exports.otpConfig = exports.otpCookieConfig = exports.authCookieConfig = exports.corsConfig = exports.rateLimiter = exports.jwtConfig = void 0;
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const envVars_1 = __importDefault(require("./envVars"));
const CLIENT_URL = envVars_1.default.CLIENT_URL;
const originWhitelist = [
    CLIENT_URL,
    "http://localhost:1905",
    "http://localhost:5173",
];
// jwt
exports.jwtConfig = {
    jwtTokenExpires: 3 * 24 * 60 * 60 * 1000, // 3 days
};
// rate limiter
exports.rateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
});
// cors
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
