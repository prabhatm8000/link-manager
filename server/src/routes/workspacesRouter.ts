import { Router } from "express";
import workspacesController from "../controllers/workspacesController";
import authMiddleware from "../middlewares/authMiddleware";
import verifyInvitTokenMiddleware from "../middlewares/verifyInvitTokenMiddleware";

const workspacesRouter = Router();
workspacesRouter.use(authMiddleware);

workspacesRouter
    .route("/")
    .post(workspacesController.createWorkspace)
    .get(workspacesController.getAllWorkspacesForUser);

workspacesRouter.get("/my", workspacesController.getWorkspaceByCreatorId);

workspacesRouter.post(
    "/invite/:workspaceId",
    workspacesController.sendInviteToJoinWorkspace
);

workspacesRouter
    .route("/invite/:workspaceId/:senderId/:token")
    .get([verifyInvitTokenMiddleware], workspacesController.getAcceptInvite)
    .post([verifyInvitTokenMiddleware], workspacesController.acceptInvite);

workspacesRouter
    .route("/id/:id")
    .get(workspacesController.getWorkspaceById)
    .patch(workspacesController.updateWorkspace)
    .delete(workspacesController.deleteWorkspace);

workspacesRouter
    .route("/people/:id")
    .get(workspacesController.getPeople)
    .post(workspacesController.removePeople);

export default workspacesRouter;
