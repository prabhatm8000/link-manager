import type { Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import otpService from "../services/otpService";
import { setOtpCookie } from "../lib/cookie";

const sendOtp = asyncWrapper(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        throw new APIResponseError("Missing required fields", 400, false);
    }

    await otpService.genarateAndSendOtpViaMain(email);
    setOtpCookie(res, { email, name, password });

    return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully" });
});

const otpController = { sendOtp };
export default otpController;
