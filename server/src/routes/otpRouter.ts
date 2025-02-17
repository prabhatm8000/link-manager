import { Router } from "express";
import otpController from "../controllers/otpController";

const otpRouter = Router();

otpRouter.post("/send", otpController.sendOtp);

export default otpRouter;
