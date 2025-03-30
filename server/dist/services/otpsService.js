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
const configs_1 = require("../constants/configs");
const response_1 = require("../errors/response");
const otps_1 = __importDefault(require("../models/otps"));
const genarateOtp = (size = 6) => {
    return Math.floor(Math.pow(10, size + 1) * Math.random())
        .toString()
        .slice(0, size);
};
const genarateAndSendOtpViaMail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = genarateOtp(configs_1.otpConfig.size);
    const expiresAt = new Date(Date.now() + configs_1.otpConfig.expiresAt);
    let otpObj = yield otps_1.default.findOne({ email });
    if (otpObj) {
        // 3 minutes
        const diff = (Date.now() - otpObj.createdAt.getTime()) / 1000;
        if (diff < 180) {
            throw new response_1.APIResponseError("Too soon, try after few minutes", 400, false);
        }
        otpObj.otp = otp;
        otpObj.expiresAt = expiresAt;
    }
    else {
        otpObj = new otps_1.default({ email, otp, expiresAt });
    }
    yield otpObj.save();
    if (!otpObj) {
        throw new Error("Failed to create or update OTP");
    }
    // await sendOtpEmail(email, otp);
    console.log(email, otp);
});
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const otpObj = yield otps_1.default.findOne({ email });
    if (!otpObj) {
        throw new response_1.APIResponseError("Invalid OTP", 400, false);
    }
    if (otpObj.expiresAt < new Date()) {
        throw new response_1.APIResponseError("OTP has expired", 400, false);
    }
    const isMatch = yield otpObj.compareOtp(otp);
    if (!isMatch) {
        throw new response_1.APIResponseError("Invalid OTP", 400, false);
    }
    yield otpObj.deleteOne();
    return true;
});
const otpService = { genarateAndSendOtpViaMail, verifyOtp };
exports.default = otpService;
