import type { NextFunction, Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import { catchHandler } from "../lib/asyncWrapper";
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

const authMiddleware = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    try {
        const payload = await getAuthCookie(req);

        const user = await usersService.getUserById(payload._id);

        if (!user) {
            throw new APIResponseError("Unauthorized", 401, false);
        }

        req.user = user;
        delete req.user.password;

        if (next) next();
    } catch (error) {
        catchHandler(error, res);
    }
};

export default authMiddleware;
