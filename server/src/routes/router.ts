import { Router } from "express";
import linksRouter from "./api/linksRouter";
import usersRouter from "./api/usersRouter";
import workspacesRouter from "./api/workspacesRouter";
import linkRedirectRouter from "./redirect/linkRedirectRouter";

const apiRouter = Router();
apiRouter.use("/user", usersRouter);
apiRouter.use("/workspace", workspacesRouter);
apiRouter.use("/link", linksRouter);

const redirectRouter = Router();
redirectRouter.use("/", linkRedirectRouter);

const router = Router();
router.use("/api/v1", apiRouter);
router.use("/", redirectRouter);

export default router;
