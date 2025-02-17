import type { Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { setAuthCookie } from "../lib/cookie";
import usersService from "../services/usersService";

const register = asyncWrapper(async (req: Request, res: Response) => {
    const { name, email, password, profilePicture } = req.body;

    if (!name || !email || !password) {
        throw new APIResponseError("Missing required fields", 400, false);
    }

    const user = await usersService.createUser({
        name,
        email,
        password,
        profilePicture,
    });

    if (!user) {
        throw new APIResponseError("User already exists", 400, false);
    }

    setAuthCookie(res, user);

    return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: user,
    });
});

const login = asyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await usersService.login({ email, password });

    if (!user) {
        throw new APIResponseError("Invalid credentials", 401, false);
    }

    setAuthCookie(res, user);

    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
    });
});

const updateUser = asyncWrapper(async (req: Request, res: Response) => {
    const { id, data } = req.body;
    const user = await usersService.updateUser(id, data);

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    return res.status(200).json({
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

    return res.status(200).json({
        success: true,
        message: "User deactivated successfully",
        data: user,
    });
});

const usersController = {
    register,
    login,
    updateUser,
    deactivateUser,
};
export default usersController;
