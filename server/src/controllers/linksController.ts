import type { Request, Response } from "express";
import StatusMessagesMark4 from "../constants/messages";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import linksService from "../services/linksService";

const statusMessages = new StatusMessagesMark4("link");

const generateShortLinkKey = asyncWrapper(
    async (req: Request, res: Response) => {
        const { size } = req.body;
        const shortLinkKey = await linksService.generateShortLinkKey(size);
        res.status(200).json({
            success: true,
            message: "",
            data: shortLinkKey,
        });
    }
);

const createLink = asyncWrapper(async (req: Request, res: Response) => {
    const {
        tags,
        destinationUrl,
        shortUrlKey,
        workspaceId,
        comment,
        expirationTime,
        password,
    } = req.body;
    if (!tags || !destinationUrl || !shortUrlKey || !workspaceId) {
        throw new APIResponseError(
            statusMessages.getMessage(
                "All fields are required",
                "error",
                "create"
            ),
            400,
            false
        );
    }

    const link = await linksService.createLink({
        destinationUrl,
        shortUrlKey,
        tags,
        comment,
        expirationTime,
        password,

        workspaceId,
        creatorId: req.user?._id.toString() || "", // can't be undefined
    });
    res.status(201).json({
        success: true,
        message: statusMessages.getMessage(
            "Link created successfully",
            "success",
            "create"
        ),
        data: link,
    });
});

const getLinkByShortUrlKey = asyncWrapper(
    async (req: Request, res: Response) => {
        const { shortUrlKey } = req.params;
        if (!shortUrlKey) {
            throw new APIResponseError(
                statusMessages.getMessage(
                    "Short URL key is required",
                    "error",
                    "other"
                ),
                400,
                false
            );
        }
        const link = await linksService.getOneLinkBy({
            shortUrlKey,
            userId: req.user?._id.toString() || "",
        });
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
            throw new APIResponseError(
                statusMessages.getMessage(
                    "Workspace ID is required",
                    "error",
                    "other"
                ),
                400,
                false
            );
        }
        const links = await linksService.getLinksByWorkspaceId(
            workspaceId,
            req.user?._id.toString() || ""
        );
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
        throw new APIResponseError(
            statusMessages.getMessage("Link ID is required", "error", "other"),
            400,
            false
        );
    }
    const link = await linksService.getOneLinkBy({
        linkId,
        userId: req.user?._id.toString() || "",
    });
    res.status(200).json({
        success: true,
        message: "",
        data: link,
    });
});

const updateLink = asyncWrapper(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    if (!linkId) {
        throw new APIResponseError(
            statusMessages.getMessage("Link ID is required", "error", "update"),
            400,
            false
        );
    }
    const link = await linksService.updateLink(
        linkId,
        req.body,
        req.user?._id.toString() || ""
    );
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage(
            "Link updated successfully",
            "success",
            "update"
        ),
        data: link,
    });
});

const deactivateLink = asyncWrapper(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    if (!linkId) {
        throw new APIResponseError(
            statusMessages.getMessage("Link ID is required", "error", "other"),
            400,
            false
        );
    }
    const link = await linksService.deactivateLink(
        linkId,
        req.user?._id.toString() || ""
    );
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage(
            "Link deactivated successfully",
            "success",
            "other"
        ),
        data: link,
    });
});

const deleteLink = asyncWrapper(async (req: Request, res: Response) => {
    const { linkId } = req.params;
    if (!linkId) {
        throw new APIResponseError(
            statusMessages.getMessage("Link ID is required", "error", "other"),
            400,
            false
        );
    }
    const link = await linksService.deleteLink(
        linkId,
        req.user?._id.toString() || ""
    );
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage(
            "Link deleted successfully",
            "success",
            "other"
        ),
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
