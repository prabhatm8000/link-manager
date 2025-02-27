import { Router } from "express";
import usersRouter from "./usersRouter";
import workspacesRouter from "./workspacesRouter";

const router = Router();

router.use("/user", usersRouter);
router.use("/workspace", workspacesRouter);

export default router;
