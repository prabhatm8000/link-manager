import type { Request, Response } from "express";
import StatusMessagesMark4 from "../constants/messages";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import fetchImage from "../lib/fetchImage";
import { fetchMetadata } from "../lib/urlMetadeta";
import linksService from "../services/linksService";
import tagsService from "../services/tagsService";
import { LinkStatus } from "../types/link";
import type { IUser } from "../types/user";

const statusMessages = new StatusMessagesMark4("link");

const generateShortUrlKey = asyncWrapper(
    async (req: Request, res: Response) => {
        const { size } = req.body;
        const ShortUrlKey = await linksService.generateShortUrlKey(size);
        res.status(200).json({
            success: true,
            message: "",
            data: ShortUrlKey,
        });
    }
);

const getMetadata = asyncWrapper(async (req: Request, res: Response) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
        throw new APIResponseError("", 400, false);
    }

    const metadata = await fetchMetadata(url);

    // loding favicon
    const faviconDataURL = await fetchImage(
        metadata.favicon,
        `${url}/${metadata.favicon}`
    );

    res.status(200).json({
        message: "",
        success: true,
        data: {
            ...metadata,
            ...(faviconDataURL && {
                faviconDataURL,
            }),
        },
    });
});

const createLink = asyncWrapper(async (req: Request, res: Response) => {
    const {
        tags,
        destinationUrl,
        metadata,
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

    const link = await linksService.createLink(
        {
            destinationUrl,
            shortUrlKey,
            metadata,
            tags,
            comment,
            expirationTime,
            password,

            workspaceId,
            creatorId: req.user?._id.toString() || "", // can't be undefined
        },
        req.user as IUser
    );
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
        const { shortUrlKey, workspaceId } = req.params;
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
            workspaceId,
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
        const q = req.query.q as string;
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
            req.user?._id.toString() || "",
            q
        );
        res.status(200).json({
            success: true,
            message: "",
            data: links,
        });
    }
);

const getLinkById = asyncWrapper(async (req: Request, res: Response) => {
    const { linkId, workspaceId } = req.params;
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
        workspaceId,
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
    const { linkId, status } = req.params;
    if (!linkId) {
        throw new APIResponseError(
            statusMessages.getMessage("Link ID is required", "error", "other"),
            400,
            false
        );
    }
    const link = await linksService.changeStatus(
        linkId,
        status as LinkStatus,
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

const tagsSuggestions = asyncWrapper(async (req: Request, res: Response) => {
    const { workspaceId, q } = req.body;
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

    const suggestions = await tagsService.searchTags(workspaceId, q);
    res.status(200).json({
        success: true,
        message: "",
        data: suggestions,
    });
});

const linksController = {
    generateShortUrlKey,
    getMetadata,
    createLink,
    getLinkByShortUrlKey,
    getLinksByWorkspaceId,
    getLinkById,
    updateLink,
    deactivateLink,
    deleteLink,
    tagsSuggestions,
};

export default linksController;
