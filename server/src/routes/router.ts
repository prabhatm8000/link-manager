import { Router } from "express";
import usersRouter from "./usersRouter";

const router = Router();

router.use("/user", usersRouter);

export default router;
