"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configs_1 = require("../../constants/configs");
const usersController_1 = __importDefault(require("../../controllers/usersController"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const verifyOtpMiddleware_1 = __importDefault(require("../../middlewares/verifyOtpMiddleware"));
const usersRouter = (0, express_1.Router)();
// auth routes with a lil stricter rate limiter
const authRoutes = (0, express_1.Router)();
authRoutes.use(configs_1.authRateLimiter);
authRoutes.post("/register-send-otp", [], usersController_1.default.registerAndSendOtp);
authRoutes.post("/resend-otp", [verifyOtpMiddleware_1.default], usersController_1.default.resendOtp);
authRoutes.post("/register-verify-otp", [verifyOtpMiddleware_1.default], usersController_1.default.registerAndVerifyOtp);
authRoutes.post("/login", [], usersController_1.default.login);
// other routes
usersRouter.use("/", authRoutes);
usersRouter.post("/logout", [authMiddleware_1.default], usersController_1.default.logout);
usersRouter.get("/verify", [authMiddleware_1.default], usersController_1.default.verify);
usersRouter.patch("/update", [authMiddleware_1.default], usersController_1.default.updateUser);
usersRouter.post("/deactivate", [authMiddleware_1.default], usersController_1.default.deactivateUser);
exports.default = usersRouter;
