"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = __importDefault(require("../../controllers/usersController"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const verifyOtpMiddleware_1 = __importDefault(require("../../middlewares/verifyOtpMiddleware"));
const usersRouter = (0, express_1.Router)();
usersRouter.post("/register-send-otp", [], usersController_1.default.registerAndSendOtp);
usersRouter.post("/resend-otp", [verifyOtpMiddleware_1.default], usersController_1.default.resendOtp);
usersRouter.post("/register-verify-otp", [verifyOtpMiddleware_1.default], usersController_1.default.registerAndVerifyOtp);
usersRouter.post("/login", [], usersController_1.default.login);
usersRouter.post("/logout", [authMiddleware_1.default], usersController_1.default.logout);
usersRouter.get("/verify", [authMiddleware_1.default], usersController_1.default.verify);
usersRouter.patch("/update", [authMiddleware_1.default], usersController_1.default.updateUser);
usersRouter.post("/deactivate", [authMiddleware_1.default], usersController_1.default.deactivateUser);
exports.default = usersRouter;
