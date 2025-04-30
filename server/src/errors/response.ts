import type { NextFunction, Request, Response } from "express";
import StatusMessagesMark4 from "../constants/messages";

export class APIResponseError extends Error {
    public status: number;
    public success: boolean;
    constructor(
        message: string | { title: string; description: string },
        status: number = 500,
        success: boolean = false
    ) {
        super(typeof message === "string" ? message : message.description);
        this.status = status;
        this.success = success;
    }
}

const statusMessages = new StatusMessagesMark4();

export const apiErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof APIResponseError) {
        res.status(error.status).json({
            success: error.success,
            message: error.message,
        });
    } else {
        console.log(req.url, error);
        res.status(500).json({
            success: false,
            message: statusMessages.getRandomInternalServerErrorMessage(),
        });
    }
};
