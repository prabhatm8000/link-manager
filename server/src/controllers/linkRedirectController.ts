import type { Request, Response } from "express";
import { APIResponseError } from "../errors/response";
import renderMetadata from "../lib/renderRedirectHtml";
import linksService from "../services/linksService";

const redirectToDestination = async (req: Request, res: Response) => {
    const { shortUrlKey } = req.params;

    if (!shortUrlKey) {
        res.status(400).json({
            success: false,
            message: "Short URL key is required",
            data: null,
        });
        return;
    }

    const url = await linksService.justTheDestinationUrl(shortUrlKey);
    if (!url) {
        throw new APIResponseError("Short URL not found", 404, false);
    }

    if (url.password) {
        throw new APIResponseError("Password protected link", 401, false);
    }
    // res.redirect(url.destinationUrl);
    res.send(renderMetadata({
        shortUrl: url.shortUrl,
        destinationUrl: url.destinationUrl,
        metadata: url.metadata
    }))
};

const linkRedirectController = {
    redirectToDestination,
};

export default linkRedirectController;
