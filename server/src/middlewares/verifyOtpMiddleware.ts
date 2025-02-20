import type { NextFunction, Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import { getOtpCookie, removeOtpCookie } from "../lib/cookie";
import otpService from "../services/otpService";
import { catchHandler } from "../lib/asyncWrapper";

const verifyOtpMiddleware = async (
    req: Request,
    res: Response,
    next?: NextFunction
) => {
    const { email, otp } = req.body;
    try {
        const payload = await getOtpCookie(req);

        if (email !== payload.email) {
            throw new APIResponseError("Unauthorized", 401, false);
        }

        const isMatch = await otpService.verifyOtp(email, otp);
        if (!isMatch) {
            throw new APIResponseError("Invalid OTP", 400, false);
        }

        removeOtpCookie(res);

        req.body = {
            ...payload,
        };

        if (next) next();
    } catch (error) {
        catchHandler(error, res);
    }
};

export default verifyOtpMiddleware;
