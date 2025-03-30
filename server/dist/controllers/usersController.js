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
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const cookie_1 = require("../lib/cookie");
const usersService_1 = __importDefault(require("../services/usersService"));
const otpsService_1 = __importDefault(require("../services/otpsService"));
const registerAndSendOtp = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new response_1.APIResponseError("Missing required fields", 400, false);
    }
    const user = yield usersService_1.default.getUserByEmail(email);
    if (user) {
        throw new response_1.APIResponseError("User already exists", 400, false);
    }
    yield otpsService_1.default.genarateAndSendOtpViaMail(email);
    (0, cookie_1.setOtpCookie)(res, { email, name, password });
    res.status(200).json({ success: true, message: "OTP sent successfully" });
}));
const resendOtp = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // from middleware
    const { name, email, password } = req.body;
    yield otpsService_1.default.genarateAndSendOtpViaMail(email);
    (0, cookie_1.setOtpCookie)(res, { email, name, password });
    res.status(200).json({ success: true, message: "OTP sent successfully" });
}));
const registerAndVerifyOtp = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // from middleware
    const { name, email, password } = req.body;
    const user = yield usersService_1.default.createUser({
        name,
        email,
        password,
    });
    (0, cookie_1.setAuthCookie)(res, user);
    res.status(200).json({
        success: true,
        message: "Signed in successfully",
        data: user,
    });
}));
const login = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield usersService_1.default.login({ email, password });
    if (!user) {
        throw new response_1.APIResponseError("Invalid credentials", 401, false);
    }
    (0, cookie_1.setAuthCookie)(res, user);
    res.status(200).json({
        success: true,
        message: "Logged in",
        data: user,
    });
}));
const logout = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, cookie_1.removeAuthCookie)(res);
    res.status(200).json({
        success: true,
        message: "Logged out",
    });
}));
const verify = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // from middleware
    const user = req.user;
    if (!user) {
        throw new response_1.APIResponseError("User not found", 404, false);
    }
    res.status(200).json({
        success: true,
        message: "",
        data: user,
    });
}));
const updateUser = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    const id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const user = yield usersService_1.default.updateUser(id, { name: data === null || data === void 0 ? void 0 : data.name });
    if (!user) {
        throw new response_1.APIResponseError("User not found", 404, false);
    }
    res.status(200).json({
        success: true,
        message: "Updated",
        data: user,
    });
}));
const deactivateUser = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const user = yield usersService_1.default.deactivateUser(id);
    if (!user) {
        throw new response_1.APIResponseError("User not found", 404, false);
    }
    res.status(200).json({
        success: true,
        message: "Deactivated successfully",
        data: user,
    });
}));
const usersController = {
    registerAndSendOtp,
    resendOtp,
    registerAndVerifyOtp,
    login,
    logout,
    verify,
    updateUser,
    deactivateUser,
};
exports.default = usersController;
