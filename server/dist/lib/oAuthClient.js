"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const envVars_1 = __importDefault(require("../constants/envVars"));
const oauthClient = new google_auth_library_1.OAuth2Client(envVars_1.default.GOOGLE_CLIENT_ID);
exports.default = oauthClient;
