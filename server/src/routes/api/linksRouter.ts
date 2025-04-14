import { Router } from "express";
import linksController from "../../controllers/linksController";
import authMiddleware from "../../middlewares/authMiddleware";

const linksRouter = Router();
linksRouter.use(authMiddleware);

linksRouter.post(
    "/generate-short-link-key",
    linksController.generateShortUrlKey
);

linksRouter.get("/metadata", linksController.getMetadata);

linksRouter.post("/", linksController.createLink);

linksRouter
    .get("/workspace/:workspaceId", linksController.getLinksByWorkspaceId);

linksRouter.get("/:linkId", linksController.getLinkById);

linksRouter.patch("/:linkId", linksController.updateLink);

linksRouter.delete("/:linkId", linksController.deleteLink);

linksRouter.patch("/:linkId/deactivate", linksController.deactivateLink);

linksRouter.get("/:shortUrlKey", linksController.getLinkByShortUrlKey);

linksRouter.post("/getTagsSuggestions", linksController.tagsSuggestions);

export default linksRouter;
