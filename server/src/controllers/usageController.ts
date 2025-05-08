import type { Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import usageService from "../services/usageService";

const getUsage = asyncWrapper(async (req: Request, res: Response) => {
    const user = req.user;
    const workspaceId = req.query.wsId as string;
    if (!user) {
        throw new Error("User not found"); // This should never happen
    }
    if (!workspaceId) {
        throw new APIResponseError("Workspace ID is required", 400, false);
    }
    
    const usage = await usageService.getUsageData(user._id.toString(), workspaceId);
    res.status(200).json({ success: true, message: "", data: usage });
});

const usageController = {
    getUsage,
};

export default usageController;
