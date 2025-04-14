import express, { Router } from "express";
import path from "path";
import envVars from "../constants/envVars";
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

if (envVars.NODE_ENV !== "dev") {
    router.use(express.static(path.join(__dirname, "../../../client/dist"), {
        maxAge: "1y",   // browser cache ui files
        etag: true      // force cache use
    }));
    
    // for prod, serving ui files
    router.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../../client/dist", "index.html"));
    });
}

router.use("/", redirectRouter);
export default router;
