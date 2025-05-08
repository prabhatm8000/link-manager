import type { Request, Response } from "express";
import StatusMessagesMark4 from "../constants/messages";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { removeAuthCookie, setAuthCookie, setOtpCookie } from "../lib/cookie";
import otpService from "../services/otpsService";
import usersService from "../services/usersService";

const statusMessages = new StatusMessagesMark4("user");

const registerAndSendOtp = asyncWrapper(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new APIResponseError(
            statusMessages.getMessage("Name, email and password are required", "error", "create"),
            400,
            false
        );
    }

    const user = await usersService.getUserByEmail(email);
    if (user) {
        throw new APIResponseError(
            statusMessages.getMessage("User with this email already exists", "error", "create"),
            400,
            false
        );
    }

    await otpService.genarateAndSendOtpViaMail(email);
    setOtpCookie(res, { email, name, password });

    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("OTP sent to your email, please verify", "success", "create"),
    });
});

const resendOtp = asyncWrapper(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    await otpService.genarateAndSendOtpViaMail(email);
    setOtpCookie(res, { email, name, password });
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("OTP resent to your email, please verify", "success", "other"),
    });
});

// verification done at middelware level
const registerAndVerifyOtp = asyncWrapper(
    async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        const user = await usersService.createUser({
            name,
            email,
            password,
        });

        setAuthCookie(res, user);

        res.status(200).json({
            success: true,
            message: statusMessages.getMessage("User created and logged in successfully", "success", "create"),
            data: user,
        });
    }
);

const login = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password, credential: credentialFromGoogleAuth } = req.body;
    const user = await usersService.login({ email, password, credentialFromGoogleAuth });

    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage("Invalid email or password", "error", "other"),
            401,
            false
        );
    }

    console.log(user);
    
    setAuthCookie(res, user);

    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Logged in successfully", "success", "other"),
        data: user,
    });
});

const logout = asyncWrapper(async (req: Request, res: Response) => {
    removeAuthCookie(res);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Logged out successfully", "success", "other"),
    });
});

const verify = asyncWrapper(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage("User not found", "error", "other"),
            404,
            false
        );
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
    const user = await usersService.updateUser(id, { name: data?.name });

    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage("User not found", "error", "update"),
            404,
            false
        );
    }

    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("User updated successfully", "success", "update"),
        data: user,
    });
});

const deactivateUser = asyncWrapper(async (req: Request, res: Response) => {
    const id = req?.user?._id as string;
    const user = await usersService.deactivateUser(id);

    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage("User not found", "error", "delete"),
            404,
            false
        );
    }

    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("User deactivated successfully", "success", "delete"),
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
