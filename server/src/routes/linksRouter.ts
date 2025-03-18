import { Router } from "express";
import linksController from "../controllers/linksController";
import authMiddleware from "../middlewares/authMiddleware";

const linksRouter = Router();
linksRouter.use(authMiddleware);

linksRouter.route("/generate-short-link-key").post(linksController.generateShortLinkKey);

linksRouter.route("/").post(linksController.createLink);

linksRouter
    .route("/workspace/:workspaceId")
    .get(linksController.getLinksByWorkspaceId);

linksRouter.route("/:linkId").get(linksController.getLinkById);

linksRouter.route("/:linkId").patch(linksController.updateLink);

linksRouter.route("/:linkId").delete(linksController.deleteLink);

linksRouter.route("/:linkId/deactivate").patch(linksController.deactivateLink);

linksRouter.route("/:shortUrlKey").get(linksController.getLinkByShortUrlKey);

export default linksRouter;
