import express, { Router } from "express";
import path from "path";
import envVars from "../constants/envVars";
import apiRouter from "./api/router";
import redirectRouter from "./redirect/router";

const router = Router();
router.use("/api/v1", apiRouter);

// has this regex logic in the route to avoid conflicts with SPA(single page app) ([a-zA-Z0-9]{10})
router.use("/", redirectRouter);

// #region Static Files
if (envVars.NODE_ENV !== "dev") {
    router.use(
        express.static(path.join(__dirname, "../../../client/dist"), {
            maxAge: "1y", // browser cache ui files
            etag: true, // force cache use
        })
    );

    // for prod, serving ui files
    router.get("*", (req, res) => {
        res.sendFile(
            path.join(__dirname, "../../../client/dist", "index.html")
        );
    });
}
// #endregion
export default router;