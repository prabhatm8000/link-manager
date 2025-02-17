import { Router } from "express";
import usersRouter from "./usersRouter";
import otpRouter from "./otpRouter";

const router = Router();

router.use("/users", usersRouter);

router.use("/otp", otpRouter);

export default router;
