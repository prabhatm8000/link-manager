import type { NextFunction, Request, Response } from "express";
import { APIResponseError } from "../errors/response";

const asyncWrapper = (
    callback: (
        req: Request,
        res: Response,
        next?: NextFunction
    ) => Promise<Response | void>
) => {
    return async (req: Request, res: Response, next?: NextFunction) => {
        try {
            await callback(req, res, next);
            if (next) next();
        } catch (error) {
            catchHandler(error, res);
        }
    };
};

export const catchHandler = (error: any, res: Response) => {
    if (error instanceof APIResponseError) {
        res.status(error.status).json({
            success: error.success,
            message: error.message,
        });
    } else {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default asyncWrapper;
