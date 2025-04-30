import { Router } from "express";
import analyticsController from "../../controllers/analyticsController";

const analyticsRouter = Router();
analyticsRouter.get("/", analyticsController.getAnalytics);
export default analyticsRouter;
