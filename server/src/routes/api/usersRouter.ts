import { Router } from "express";
import { authRateLimiter } from "../../constants/configs";
import usersController from "../../controllers/usersController";
import authMiddleware from "../../middlewares/authMiddleware";
import verifyOtpMiddleware from "../../middlewares/verifyOtpMiddleware";

const usersRouter = Router();

// auth routes with a lil stricter rate limiter
const authRoutes = Router();
authRoutes.use(authRateLimiter);
authRoutes.post("/register-send-otp", [], usersController.registerAndSendOtp);
authRoutes.post("/resend-otp", [verifyOtpMiddleware], usersController.resendOtp);
authRoutes.post(
    "/register-verify-otp",
    [verifyOtpMiddleware],
    usersController.registerAndVerifyOtp
);
authRoutes.post("/login", [], usersController.login);

// other routes
usersRouter.use("/", authRoutes);
usersRouter.post("/logout", [authMiddleware], usersController.logout);

usersRouter.get("/verify", [authMiddleware], usersController.verify);

usersRouter.patch("/update", [authMiddleware], usersController.updateUser);

usersRouter.post(
    "/deactivate",
    [authMiddleware],
    usersController.deactivateUser
);

export default usersRouter;
