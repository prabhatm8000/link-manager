import type { NextFunction, Request, Response } from "express";
import asyncWrapper from "../lib/asyncWrapper";
import { getOtpCookie } from "../lib/cookie";
import otpService from "../services/otpService";
import { APIResponseError } from "../errors/response";
import { otpCookieConfig } from "../constants/configs";

const verifyOtpMiddleware = asyncWrapper(
    async (req: Request, res: Response, next?: NextFunction) => {
        const payload = await getOtpCookie(req);

        const { email, otp } = req.body;
        if (email !== payload.email) {
            throw new APIResponseError("Unauthorized", 401, false);
        }

        const isMatch = await otpService.verifyOtp(email, otp);
        if (!isMatch) {
            throw new APIResponseError("Invalid OTP", 400, false);
        }

        res.clearCookie(otpCookieConfig.otpCookieName);
        req.body = {
            ...payload,
        };

        if (next) next();
    }
);

export default verifyOtpMiddleware;
