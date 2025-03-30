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
            console.log(callback.name);
            catchHandler(error, req, res);
        }
        res.end();
    };
};

export const catchHandler = (error: any, req: Request, res: Response) => {
    if (error instanceof APIResponseError) {
        res.status(error.status).json({
            success: error.success,
            message: error.message,
        });
    } else {
        console.log(req.url, error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export default asyncWrapper;
