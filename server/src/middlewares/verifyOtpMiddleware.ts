import type { NextFunction, Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { getOtpCookie, removeOtpCookie } from "../lib/cookie";
import otpService from "../services/otpsService";

const verifyOtpMiddleware = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        // email, otp will be undefined on resend === true
        const { email, otp, resend } = req.body;
        const payload = await getOtpCookie(req);

        if (!resend) {
            if (email !== payload.email) {
                throw new APIResponseError("Unauthorized", 401, false);
            }

            const isMatch = await otpService.verifyOtp(email, otp);
            if (!isMatch) {
                throw new APIResponseError("Invalid OTP", 400, false);
            }
        }

        removeOtpCookie(res);

        req.body = {
            ...payload,
        };

        next();
    }
);

export default verifyOtpMiddleware;
