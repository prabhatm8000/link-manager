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

    await otpService.genarateAndSendOtpViaMain(email);
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
            message: "User created successfully",
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
        message: "User logged in successfully",
        data: user,
    });
});

const logout = asyncWrapper(async (req: Request, res: Response) => {
    removeAuthCookie(res);
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
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
    const { id, data } = req.body;
    const user = await usersService.updateUser(id, data);

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
    });
});

const deactivateUser = asyncWrapper(async (req: Request, res: Response) => {
    const { id } = req.body;
    const user = await usersService.deactivateUser(id);

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    res.status(200).json({
        success: true,
        message: "User deactivated successfully",
        data: user,
    });
});

const usersController = {
    registerAndSendOtp,
    registerAndVerifyOtp,
    login,
    logout,
    verify,
    updateUser,
    deactivateUser,
};
export default usersController;
