import type { NextFunction, Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { getAuthCookie } from "../lib/cookie";
import usersService from "../services/usersService";
import type { IUser } from "../types/user";

// adding user to request
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const authMiddleware = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = await getAuthCookie(req);
        const user = await usersService.getUserById(payload._id);
        if (!user) {
            throw new APIResponseError("", 401, false);
        }

        req.user = user;
        delete req.user.password;

        next();
    }
);

export default authMiddleware;
