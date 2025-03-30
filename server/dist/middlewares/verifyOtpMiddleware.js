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
const response_1 = require("../errors/response");
const cookie_1 = require("../lib/cookie");
const otpsService_1 = __importDefault(require("../services/otpsService"));
const asyncWrapper_1 = require("../lib/asyncWrapper");
const verifyOtpMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // email, otp will be undefined on resend === true
    const { email, otp, resend } = req.body;
    try {
        const payload = yield (0, cookie_1.getOtpCookie)(req);
        if (!resend) {
            if (email !== payload.email) {
                throw new response_1.APIResponseError("Unauthorized", 401, false);
            }
            const isMatch = yield otpsService_1.default.verifyOtp(email, otp);
            if (!isMatch) {
                throw new response_1.APIResponseError("Invalid OTP", 400, false);
            }
        }
        (0, cookie_1.removeOtpCookie)(res);
        req.body = Object.assign({}, payload);
        if (next)
            next();
    }
    catch (error) {
        (0, asyncWrapper_1.catchHandler)(error, res);
    }
});
exports.default = verifyOtpMiddleware;
