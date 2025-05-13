import type { Request, Response } from "express";
import StatusMessagesMark4 from "../constants/messages";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { removeAuthCookie, setAuthCookie } from "../lib/cookie";
import { sendPasswordResetEmail, sendVerificationEmail } from "../lib/mail";
import tokensService from "../services/tokensService";
import usersService from "../services/usersService";

const statusMessages = new StatusMessagesMark4("user");

const registerAndSendVerification = asyncWrapper(
    async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new APIResponseError(
                statusMessages.getMessage(
                    "Name, email and password are required",
                    "error",
                    "create"
                ),
                400,
                false
            );
        }

        const existingUser = await usersService.getUserByEmail(email);
        if (existingUser) {
            throw new APIResponseError(
                statusMessages.getMessage(
                    "User with this email already exists",
                    "error",
                    "create"
                ),
                400,
                false
            );
        }

        const user = await usersService.createUser({
            name,
            email,
            password,
        });

        const { link: verificationLink, token } =
            usersService.genarateEmailVerficationLink(user);

        await tokensService.create(token, "VERIFICATION", user._id.toString());
        await sendVerificationEmail(user.email, verificationLink);

        res.status(200).json({
            success: true,
            message: {
                ...statusMessages.getMessage(
                    "Verfication mail sent to your email, please verify and login!",
                    "success",
                    "create"
                ),
                toastDuration: 10000,
            },
        });
    }
);

const resendVerification = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new APIResponseError(
            statusMessages.getMessage(
                "Email and password are required",
                "error",
                "create"
            ),
            400,
            false
        );
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage("User not found", "error", "create"),
            400,
            false
        );
    }

    const { link: verificationLink, token } = usersService.genarateEmailVerficationLink(user);

    await tokensService.create(token, "VERIFICATION", user._id.toString());
    await sendVerificationEmail(user.email, verificationLink);

    res.status(200).json({
        success: true,
        message: {
            ...statusMessages.getMessage(
                "Verfication mail sent to your email, please verify and login!",
                "success",
                "create"
            ),
            toastDuration: 10000,
        },
    });
});

const sendPasswordReset = asyncWrapper(async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await usersService.getUserByEmail(email);
    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage("User not found", "error", "other"),
            404,
            false
        );
    }

    const { link: resetLink, token } = usersService.genaratePasswordResetLink(user);

    await tokensService.create(token, "RESET_PASSWORD", user._id.toString());
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({
        success: true,
        message: {
            ...statusMessages.getMessage(
                "Password reset link sent to your email",
                "success",
                "other"
            ),
            toastDuration: 10000,
        },
    });
});

const resetPassword = asyncWrapper(async (req: Request, res: Response) => {
    const { uid, vt, pw } = req.body;
    if (!uid || !vt || !pw) {
        throw new APIResponseError(
            statusMessages.getMessage(
                "Invalid password reset link",
                "error",
                "other"
            ),
            400,
            false
        );
    }

    const user = await usersService.resetPassword(uid, vt, pw);
    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage("Password reset failed", "error", "other"),
            400,
            false
        );
    }

    setAuthCookie(res, user);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage(
            "Password reset successful",
            "success",
            "other"
        ),
        data: user,
    });
});

const verifyUserEmail = asyncWrapper(async (req: Request, res: Response) => {
    const { uid, vt } = req.body;
    if (!uid || !vt) {
        throw new APIResponseError(
            statusMessages.getMessage(
                "Invalid verification link",
                "error",
                "other"
            ),
            400,
            false
        );
    }

    const user = await usersService.verifyUserEmail(uid, vt);
    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage("Verfication failed", "error", "other"),
            400,
            false
        );
    }

    setAuthCookie(res, user);

    res.status(200).json({
        success: true,
        message: statusMessages.getMessage(
            "Verfication successful",
            "success",
            "other"
        ),
        data: user,
    });
});

const cancelVerificationAndDeleteUser = asyncWrapper(
    async (req: Request, res: Response) => {
        const { uid, vt } = req.body;
        if (!uid || !vt) {
            throw new APIResponseError(
                statusMessages.getMessage(
                    "Invalid verification link",
                    "error",
                    "other"
                ),
                400,
                false
            );
        }

        await usersService.cancelVerificationAndDeleteUser(uid, vt);

        res.status(200).json({
            success: true,
            message: statusMessages.getMessage(
                "Canceled verfication and account deleted",
                "success",
                "other"
            ),
        });
    }
);

const login = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password, credential: credentialFromGoogleAuth } = req.body;
    const user = await usersService.login({
        email,
        password,
        credentialFromGoogleAuth,
    });

    if (!user) {
        throw new APIResponseError(
            statusMessages.getMessage(
                "Invalid email or password",
                "error",
                "other"
            ),
            401,
            false
        );
    }

    setAuthCookie(res, user);

    res.status(200).json({
        success: true,
        message: statusMessages.getMessage(
            "Logged in successfully",
            "success",
            "other"
        ),
        data: user,
    });
});

const logout = asyncWrapper(async (req: Request, res: Response) => {
    removeAuthCookie(res);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage(
            "Logged out successfully",
            "success",
            "other"
        ),
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
        message: statusMessages.getMessage(
            "User updated successfully",
            "success",
            "update"
        ),
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
        message: statusMessages.getMessage(
            "User deactivated successfully",
            "success",
            "delete"
        ),
        data: user,
    });
});

const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
    const id = req?.user?._id as string;
    await usersService.deleteUser(id);
    removeAuthCookie(res);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage(
            "User deleted successfully",
            "success",
            "delete"
        ),
    });
});

const usersController = {
    registerAndSendVerification,
    verifyUserEmail,
    cancelVerificationAndDeleteUser,
    resendVerification,
    sendPasswordReset,
    resetPassword,    
    login,
    logout,
    verify,
    updateUser,
    deactivateUser,
    deleteUser,
};

export default usersController;
