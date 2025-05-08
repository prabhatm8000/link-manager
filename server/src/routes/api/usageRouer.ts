import { Router } from "express";
import usageController from "../../controllers/usageController";
import authMiddleware from "../../middlewares/authMiddleware";

const usageRouter = Router();

usageRouter.use(authMiddleware);
usageRouter.get("/", usageController.getUsage);

export default usageRouter;
