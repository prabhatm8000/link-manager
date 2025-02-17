import type { NextFunction, Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { getAuthCookie } from "../lib/cookie";
import type { IUser } from "../models/users";
import usersService from "../services/usersService";

// declare module "express" {
//     export interface Request {
//         user?: IUser;
//     }
// }

// adding user to request
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

const authMiddleware = asyncWrapper(
    async (req: Request, res: Response, next?: NextFunction) => {
        const payload = await getAuthCookie(req);

        const user = await usersService.getUserById(payload.id);
        if (!user) {
            throw new APIResponseError("Unauthorized", 401, false);
        }

        req.user = user;

        if (next) next();
    }
);

export default authMiddleware;
