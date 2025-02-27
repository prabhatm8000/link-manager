import { Router } from "express";
import usersController from "../controllers/usersController";
import authMiddleware from "../middlewares/authMiddleware";
import verifyOtpMiddleware from "../middlewares/verifyOtpMiddleware";

const usersRouter = Router();

usersRouter.post("/register-send-otp", [], usersController.registerAndSendOtp);

usersRouter.post(
    "/register-verify-otp",
    [verifyOtpMiddleware],
    usersController.registerAndVerifyOtp
);

usersRouter.post("/login", [], usersController.login);

usersRouter.post("/logout", [authMiddleware], usersController.logout);

usersRouter.get("/verify", [authMiddleware], usersController.verify);

usersRouter.patch("/update", [authMiddleware], usersController.updateUser);

usersRouter.post(
    "/deactivate",
    [authMiddleware],
    usersController.deactivateUser
);

export default usersRouter;
