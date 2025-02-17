import { Router } from "express";
import usersController from "../controllers/usersController";
import authMiddleware from "../middlewares/authMiddleware";
import verifyOtpMiddleware from "../middlewares/verifyOtpMiddleware";

const usersRouter = Router();

usersRouter.post("/register", [verifyOtpMiddleware], usersController.register);

usersRouter.post("/login", [], usersController.login);

usersRouter.patch("/update", [authMiddleware], usersController.updateUser);

usersRouter.post(
    "/deactivate",
    [authMiddleware],
    usersController.deactivateUser
);

export default usersRouter;
