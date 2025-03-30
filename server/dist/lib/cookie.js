"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOtpCookie = exports.getOtpCookie = exports.setOtpCookie = exports.removeAuthCookie = exports.getAuthCookie = exports.setAuthCookie = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../constants/configs");
const envVars_1 = __importDefault(require("../constants/envVars"));
const response_1 = require("../errors/response");
const JWT_SECRET = envVars_1.default.JWT_SECRET;
// #region auth
const setAuthCookie = (res, payload) => {
    const token = jsonwebtoken_1.default.sign({ payload }, JWT_SECRET, {
        expiresIn: configs_1.jwtConfig.jwtTokenExpires,
    });
    res.cookie(configs_1.authCookieConfig.authCookieName, token, Object.assign({}, configs_1.authCookieConfig));
};
exports.setAuthCookie = setAuthCookie;
const getAuthCookie = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a[configs_1.authCookieConfig.authCookieName];
    if (!token) {
        throw new response_1.APIResponseError("", 401, false);
    }
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded.payload) {
        throw new response_1.APIResponseError("", 401, false);
    }
    return decoded.payload;
});
exports.getAuthCookie = getAuthCookie;
const removeAuthCookie = (res) => {
    res.clearCookie(configs_1.authCookieConfig.authCookieName);
};
exports.removeAuthCookie = removeAuthCookie;
const setOtpCookie = (res, payload) => {
    const token = jsonwebtoken_1.default.sign({ payload }, JWT_SECRET, {
        expiresIn: configs_1.otpConfig.expiresAt,
    });
    res.cookie(configs_1.otpCookieConfig.otpCookieName, token, Object.assign({}, configs_1.otpCookieConfig));
};
exports.setOtpCookie = setOtpCookie;
const getOtpCookie = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a[configs_1.otpCookieConfig.otpCookieName];
    if (!token) {
        throw new response_1.APIResponseError("Unauthorized", 401, false);
    }
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded.payload) {
        throw new response_1.APIResponseError("Unauthorized", 401, false);
    }
    return decoded.payload;
});
exports.getOtpCookie = getOtpCookie;
const removeOtpCookie = (res) => {
    res.clearCookie(configs_1.otpCookieConfig.otpCookieName);
};
exports.removeOtpCookie = removeOtpCookie;
// #endregion otp
