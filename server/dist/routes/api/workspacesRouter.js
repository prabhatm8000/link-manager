"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspacesController_1 = __importDefault(require("../../controllers/workspacesController"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const verifyInvitTokenMiddleware_1 = __importDefault(require("../../middlewares/verifyInvitTokenMiddleware"));
const workspacesRouter = (0, express_1.Router)();
workspacesRouter.use(authMiddleware_1.default);
workspacesRouter
    .route("/")
    .post(workspacesController_1.default.createWorkspace)
    .get(workspacesController_1.default.getAllWorkspacesForUser);
workspacesRouter.get("/my", workspacesController_1.default.getMyWorkspaces);
workspacesRouter.post("/invite/:workspaceId", workspacesController_1.default.sendInviteToJoinWorkspace);
workspacesRouter
    .route("/invite/:workspaceId/:senderId/:token")
    .get([verifyInvitTokenMiddleware_1.default], workspacesController_1.default.getAcceptInvite)
    .post([verifyInvitTokenMiddleware_1.default], workspacesController_1.default.acceptInvite);
workspacesRouter
    .route("/id/:id")
    .get(workspacesController_1.default.getWorkspaceById)
    .patch(workspacesController_1.default.updateWorkspace)
    .delete(workspacesController_1.default.deleteWorkspace);
workspacesRouter
    .route("/people/:id")
    .get(workspacesController_1.default.getPeople)
    .post(workspacesController_1.default.removePeople);
exports.default = workspacesRouter;
