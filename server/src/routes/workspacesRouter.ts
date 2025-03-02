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

workspacesRouter.get(
    "/invite/:workspaceId/:senderId/:token",
    [verifyInvitTokenMiddleware],
    workspacesController.getAcceptInvite
);
workspacesRouter.post(
    "/invite/:workspaceId/:senderId/:token",
    [verifyInvitTokenMiddleware],
    workspacesController.acceptInvite
);

workspacesRouter
    .route("/id/:id")
    .get(workspacesController.getWorkspaceById)
    .patch(workspacesController.updateWorkspace)
    .delete(workspacesController.deleteWorkspace);

workspacesRouter
    .route("/team-members/:id")
    .get(workspacesController.getTeamMembers)
    .post(workspacesController.removeTeamMember);

export default workspacesRouter;
