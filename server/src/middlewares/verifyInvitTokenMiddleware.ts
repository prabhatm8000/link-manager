import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import envVars from "../constants/envVars";
import { APIResponseError } from "../errors/response";

const JWT_SECRET = envVars.JWT_SECRET as string;

const verifyInvitTokenMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { senderId, workspaceId, token } = req.params;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === "string" || !decoded.payload) {
            throw new APIResponseError("Unauthorized", 401, false);
        }

        if (
            decoded.payload.workspaceId !== workspaceId ||
            decoded.payload.senderId !== senderId
        ) {
            throw new APIResponseError("Bad Request", 401, false);
        }

        if (decoded.payload.recipientEmail !== req.user?.email) {
            throw new APIResponseError("Unauthorized", 401, false);
        }

        next();
    } catch (error) {}
};

export default verifyInvitTokenMiddleware;