import { Router } from "express";
import { authRateLimiter } from "../../constants/configs";
import usersController from "../../controllers/usersController";
import authMiddleware from "../../middlewares/authMiddleware";

const usersRouter = Router();

// auth routes with a lil stricter rate limiter
const authRoutes = Router();
authRoutes.use(authRateLimiter);
authRoutes.post("/register", usersController.registerAndSendVerification);
authRoutes.post("/resendVerification", usersController.resendVerification);
authRoutes.post("/verifyUserEmail", usersController.verifyUserEmail);
authRoutes.post("/cancelVerification", usersController.cancelVerificationAndDeleteUser);
authRoutes.post("/sendPasswordReset", usersController.sendPasswordReset);
authRoutes.post("/resetPassword", usersController.resetPassword);
authRoutes.post("/login", usersController.login);

// other routes
usersRouter.use("/", authRoutes);
usersRouter.post("/logout", [authMiddleware], usersController.logout);

usersRouter.get("/verify", [authMiddleware], usersController.verify);

usersRouter.patch("/update", [authMiddleware], usersController.updateUser);

usersRouter.delete("/delete", [authMiddleware], usersController.deleteUser);

usersRouter.post(
    "/deactivate",
    [authMiddleware],
    usersController.deactivateUser
);

export default usersRouter;
