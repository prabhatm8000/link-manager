import type { NextFunction, Request, Response } from "express";
import requestIp from "request-ip";
import asyncWrapper from "../lib/asyncWrapper";
import { getGeoLocation, getUserAgent, type GeoLocationType } from "../lib/eventData";
import type { UserAgentData } from "../types/event";

declare global {
    namespace Express {
        interface Request {
            /**
             * will only be available for linkRedirect
             */
            userAgentData?: UserAgentData;
        }
    }
}

const uaMiddleware = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        const ua = getUserAgent(req);
        const ip = requestIp.getClientIp(req);

        let geoData: GeoLocationType | null = null
        if (ip) {
            geoData = await getGeoLocation(ip);
        }

        req.userAgentData = {
            userAgent: req.headers["user-agent"] || "",
            ip: ip || "unknown",
            browser: ua.browser.name || "unknown",
            os: ua.os.name || "unknown",
            device: ua.device.type || "desktop",
            country: geoData?.country || "unknown",
            region: geoData?.region || "unknown",
            city: geoData?.city || "unknown",
            referer: req.headers.referer || "unknown",
        };
        next();
    }
);

export default uaMiddleware;
