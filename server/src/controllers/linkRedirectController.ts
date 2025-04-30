import type { Request, Response } from "express";
import envVars from "../constants/envVars";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import renderMetadata from "../lib/renderRedirectHtml";
import analyticsService from "../services/analyticsService";
import eventsService from "../services/eventsService";
import linksService from "../services/linksService";
import workspacesService from "../services/workspacesService";

const redirectToDestination = asyncWrapper(
    async (req: Request, res: Response) => {
        const { shortUrlKey } = req.params;
        const password = req.query?.p;

        if (!shortUrlKey) {
            res.status(400).json({
                success: false,
                message: "Short URL key is required",
                data: null,
            });
            return;
        }

        let destinationUrl;
        let status;
        let messedUpFlag = false;

        const url = await linksService.justTheLink(shortUrlKey);
        if (!url || !url.shortUrl) {
            throw new APIResponseError("Short URL not found", 404, false);
        }
        destinationUrl = url.destinationUrl;
        status = url.status;

        if (url.expirationTime && url.expirationTime < new Date()) {
            destinationUrl =
                "/error-page?code=410&title=Link%20Expired&description=The%20link%20has%20expired.";
            messedUpFlag = true;
        }

        // password protected
        if (url.password) {
            if (!password || typeof password !== "string") {
                // not password, ask for password
                destinationUrl = "/link-password?surl=" + url.shortUrl;
                messedUpFlag = true;
            } else if (!(await url.comparePassword(password))) {
                // wrong password
                destinationUrl =
                    "/link-password?error=true&surl=" + url.shortUrl;
                messedUpFlag = true;
            }
        }

        // if we messed up, we are redirecting our self,
        // and if we are in dev mode, we need to add the client url
        if (messedUpFlag && envVars.NODE_ENV === "dev") {
            destinationUrl = envVars.CLIENT_URL + destinationUrl;
        }

        if (!messedUpFlag) {
            // capturing the event on no messedUpFlag
            // void, i know but we don't care about the result
            // and intentionally not using await
            void linksService
                .incrementClickCount(url._id)
                .catch((err) =>
                    console.error("Click count increment failed:", err)
                );

            void workspacesService
                .incrementEventCount(url.workspaceId)
                .catch((err) =>
                    console.error("Event count increment failed:", err)
                );

            void eventsService
                .captureEvent(url.workspaceId, url._id, "CLICK", req.metadata)
                .catch((err) => console.error("Event capture failed:", err));

            // capturing the analytics data (date wise)
            void analyticsService
                .captureData({
                    workspaceId: url.workspaceId,
                    linkId: url._id,
                    metadata: req.metadata,
                })
                .catch((err) =>
                    console.error("Analytics capture failed:", err)
                );
        }

        res.send(
            renderMetadata({
                shortUrl: url.shortUrl,
                destinationUrl,
                metadata: url.metadata,
                status,
            })
        );
    }
);

const linkRedirectController = {
    redirectToDestination,
};

export default linkRedirectController;
