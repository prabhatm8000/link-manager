import type { NextFunction, Request, Response } from "express";
import requestIp from "request-ip";
import { UAParser } from "ua-parser-js";
import asyncWrapper from "../lib/asyncWrapper";
import type { UserAgentData } from "../types/event";

declare global {
    namespace Express {
        interface Request {
            /**
             * will only be available for linkRedirect
             */
            metadata: UserAgentData;
        }
    }
}

const uaMiddleware = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        const parser = new UAParser(req.headers["user-agent"]);
        const ua = parser.getResult();
        const ip = requestIp.getClientIp(req);

        const regionData = req.headers["x-vercel-ip-country"];
        let region = "";
        if (Array.isArray(regionData)) {
            region = regionData.join(",");
        } else {
            region = regionData || "unknown";
        }

        req.metadata = {
            userAgent: req.headers["user-agent"] || "",
            ip: ip || "unknown",
            browser: ua.browser.name || "unknown",
            os: ua.os.name || "unknown",
            device: ua.device.type || "desktop",
            region,
            referer: req.headers.referer || "unknown",
        };
        next();
    }
);

export default uaMiddleware;
