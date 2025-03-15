import { Router } from "express";
import usersRouter from "./usersRouter";
import workspacesRouter from "./workspacesRouter";
import linksRouter from "./linksRouter";
const router = Router();

router.use("/user", usersRouter);
router.use("/workspace", workspacesRouter);
router.use("/link", linksRouter);

export default router;
