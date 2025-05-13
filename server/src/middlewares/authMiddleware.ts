import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { getAuthCookie } from "../lib/cookie";
import User from "../models/users";
import type { IUser } from "../types/user";

// adding user to request
declare global {
    namespace Express {
        interface Request {
            user?: Pick<
                IUser,
                | "_id"
                | "name"
                | "email"
                | "profilePicture"
                | "lastLogin"
                | "usage"
            >;
        }
    }
}

const authMiddleware = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = await getAuthCookie(req);
        
        const user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(payload._id),
                },
            },
            {
                $lookup: {
                    from: "usages",
                    localField: "usageId",
                    foreignField: "_id",
                    as: "usage",
                },
            },
            {
                $unwind: {
                    path: "$usage",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    profilePicture: 1,
                    lastLogin: 1,
                    usage: "$usage",
                },
            },
        ]);
        if (user.length === 0) {
            throw new APIResponseError("", 401, false);
        }
        
        req.user = user[0];
        next();
    }
);

export default authMiddleware;
