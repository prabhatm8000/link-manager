import { Router } from "express";
import analyticsController from "../../controllers/analyticsController";

const analyticsRouter = Router();
analyticsRouter.get("/:workspaceId/:linkId", analyticsController.getAnalytics);
export default analyticsRouter;
