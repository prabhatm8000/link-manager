"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.NODE_ENV === "dev"
        ? process.env.DEV_CLIENT_URL
        : process.env.PROD_CLIENT_URL,
    SERVER_URL: process.env.NODE_ENV === "dev"
        ? process.env.DEV_SERVER_URL
        : process.env.PROD_SERVER_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    // GOOGLE AUTH
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
};
exports.default = envVars;
