import type { Request, Response } from "express";
import linksService from "../services/linksService";
import asyncWrapper from "../lib/asyncWrapper";
import { APIResponseError } from "../errors/response";

const generateShortLinkKey = asyncWrapper(async (req: Request, res: Response) => {
    const { size } = req.body;
    const shortLinkKey = await linksService.generateShortLinkKey(size);
    res.status(200).json({
        success: true,
        message: "",
        data: shortLinkKey,
    });
});

const createLink = asyncWrapper(async (req: Request, res: Response) => {
    const { name, tags, destinationUrl, shortUrlKey, creatorId, workspaceId, comment } =
        req.body;
    if (
        !name ||
        !tags ||
        !destinationUrl ||
        !shortUrlKey ||
        !creatorId ||
        !workspaceId ||
        !comment
    ) {
        throw new APIResponseError("All fields are required", 400, false);
    }

    const link = await linksService.createLink({
        name,
        tags,
        destinationUrl,
        shortUrlKey,
        creatorId,
        workspaceId,
        comment,
    });
    res.status(201).json({
        success: true,
        message: "Link created successfully",
        data: link,
    });
});

const getLinkByShortUrlKey = asyncWrapper(
    async (req: Request, res: Response) => {
        const { shortUrlKey } = req.params;
        if (!shortUrlKey) {
            throw new APIResponseError("Short URL key is required", 400, false);
        }
        const link = await linksService.getLinkByShortUrlKey(shortUrlKey);
        res.status(200).json({
            success: true,
            message: "",
            data: link,
        });
    }
);

const getLinksByWorkspaceId = asyncWrapper(
    async (req: Request, res: Response) => {
        const { workspaceId } = req.params;
        if (!workspaceId) {
            throw new APIResponseError("Workspace ID is required", 400, false);
        }
        const links = await linksService.getLinksByWorkspaceId(workspaceId);
        res.status(200).json({
            success: true,
            message: "",
            data: links,
        });
    }
);

const getLinkById = asyncWrapper(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    if (!linkId) {
        throw new APIResponseError("Link ID is required", 400, false);
    }
    const link = await linksService.getLinkById(linkId);
    res.status(200).json({
        success: true,
        message: "",
        data: link,
    });
});

const updateLink = asyncWrapper(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    if (!linkId) {
        throw new APIResponseError("Link ID is required", 400, false);
    }
    const link = await linksService.updateLink(linkId, req.body);
    res.status(200).json({
        success: true,
        message: "Link updated successfully",
        data: link,
    });
});

const deactivateLink = asyncWrapper(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    if (!linkId) {
        throw new APIResponseError("Link ID is required", 400, false);
    }
    const link = await linksService.deactivateLink(linkId);
    res.status(200).json({
        success: true,
        message: "Link deactivated successfully",
        data: link,
    });
});

const deleteLink = asyncWrapper(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    if (!linkId) {
        throw new APIResponseError("Link ID is required", 400, false);
    }
    const link = await linksService.deleteLink(linkId);
    res.status(200).json({
        success: true,
        message: "Link deleted successfully",
        data: link,
    });
});

const linksController = {
    generateShortLinkKey,
    createLink,
    getLinkByShortUrlKey,
    getLinksByWorkspaceId,
    getLinkById,
    updateLink,
    deactivateLink,
    deleteLink,
};

export default linksController;
