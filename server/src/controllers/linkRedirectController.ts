import type { Request, Response } from "express";
import linksService from "../services/linksService";

const redirectToDestination = async (req: Request, res: Response) => {
    const { shortUrlKey } = req.params;

    console.log(shortUrlKey, "shortUrlKey");
    

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
        res.status(404).json({
            success: false,
            message: "Short URL not found",
            data: null,
        });
        return;
    }
    if (url.password) {
        res.status(401).json({
            success: false,
            message: "Password protected link",
            data: null,
        });
        return;
    }
    res.redirect(url.destinationUrl);
};

const linkRedirectController = {
    redirectToDestination,
};

export default linkRedirectController;
