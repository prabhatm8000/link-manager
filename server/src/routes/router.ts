import express, { Router } from "express";
import path from "path";
import envVars from "../constants/envVars";
import apiRouter from "./api/router";
import redirectRouter from "./redirect/router";

const router = Router();
router.use("/api/v1", apiRouter);

// has this regex logic in the route to avoid conflicts with SPA(single page app) ([a-zA-Z0-9]{shortKeyUrlLength})
router.use("/", redirectRouter);

const clientBuildPath = path.join(__dirname, "../../clientBuild");
// #region Static Files

if (envVars.NODE_ENV !== "dev") {

    // <------- future me, hope your doing do ----->
    // caching the static files in the client side
    // files after client build, contains a hased value in the filename, 
    // so 'cause of that, new build will have different filename.
    // which the browser WILL fetch!

    // but index.html will be index.html
    // and that contains the files that needs to be fetched, 
    // so basically you dumb piece of SHIT, 

    // old index.html -> old static files           -> updates are not applied
    // so DO NOT CACHE '''''''''''''index.html'''''''''''''''

    router.use(
        express.static(clientBuildPath, {
            maxAge: "30d", // caching
            etag: true, // force cache use
            setHeaders: (res, filePath) => {    // not caching index.html
                if (filePath.endsWith("index.html")) {
                    res.setHeader("Cache-Control", "no-store");
                }
            },
        })
    );

    // for prod, serving ui files
    router.get("*", (req, res) => {
        res.setHeader("Cache-Control", "no-store"); // index.html no cached
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
}
// #endregion
export default router;
