import { Router } from "express";
import workspacesController from "../controllers/workspacesController";
import authMiddleware from "../middlewares/authMiddleware";

const workspacesRouter = Router();
workspacesRouter.use(authMiddleware);

workspacesRouter
    .route("/")
    .post(workspacesController.createWorkspace)
    .get(workspacesController.getAllWorkspacesForUser);

workspacesRouter.get("/my", workspacesController.getWorkspaceByCreatorId);

workspacesRouter
    .route("/id/:id")
    .get(workspacesController.getWorkspaceById)
    .patch(workspacesController.updateWorkspace)
    .delete(workspacesController.deleteWorkspace);

export default workspacesRouter;
