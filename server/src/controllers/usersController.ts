import type { Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { removeAuthCookie, setAuthCookie, setOtpCookie } from "../lib/cookie";
import usersService from "../services/usersService";
import otpService from "../services/otpsService";

const registerAndSendOtp = asyncWrapper(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new APIResponseError("Missing required fields", 400, false);
    }

    const user = await usersService.getUserByEmail(email);
    if (user) {
        throw new APIResponseError("User already exists", 400, false);
    }

    await otpService.genarateAndSendOtpViaMail(email);
    setOtpCookie(res, { email, name, password });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
});

const resendOtp = asyncWrapper(async (req: Request, res: Response) => {
    // from middleware
    const { name, email, password } = req.body;
    await otpService.genarateAndSendOtpViaMail(email);
    setOtpCookie(res, { email, name, password });
    res.status(200).json({ success: true, message: "OTP sent successfully" });
});

const registerAndVerifyOtp = asyncWrapper(
    async (req: Request, res: Response) => {
        // from middleware
        const { name, email, password } = req.body;

        const user = await usersService.createUser({
            name,
            email,
            password,
        });

        setAuthCookie(res, user);

        res.status(200).json({
            success: true,
            message: "Signed in successfully",
            data: user,
        });
    }
);

const login = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await usersService.login({ email, password });

    if (!user) {
        throw new APIResponseError("Invalid credentials", 401, false);
    }

    setAuthCookie(res, user);

    res.status(200).json({
        success: true,
        message: "Logged in",
        data: user,
    });
});

const logout = asyncWrapper(async (req: Request, res: Response) => {
    removeAuthCookie(res);
    res.status(200).json({
        success: true,
        message: "Logged out",
    });
});

const verify = asyncWrapper(async (req: Request, res: Response) => {
    // from middleware
    const user = req.user;

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    res.status(200).json({
        success: true,
        message: "",
        data: user,
    });
});

const updateUser = asyncWrapper(async (req: Request, res: Response) => {
    const data = req.body;
    const id = req?.user?._id as string;
    const user = await usersService.updateUser(id, {name: data?.name});

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    res.status(200).json({
        success: true,
        message: "Updated",
        data: user,
    });
});

const deactivateUser = asyncWrapper(async (req: Request, res: Response) => {
    const id = req?.user?._id as string;
    const user = await usersService.deactivateUser(id);

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    res.status(200).json({
        success: true,
        message: "Deactivated successfully",
        data: user,
    });
});

const usersController = {
    registerAndSendOtp,
    resendOtp,
    registerAndVerifyOtp,
    login,
    logout,
    verify,
    updateUser,
    deactivateUser,
};
export default usersController;
