"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = __importDefault(require("../constants/messages"));
const response_1 = require("../errors/response");
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const mail_1 = require("../lib/mail");
const workspacesService_1 = __importDefault(require("../services/workspacesService"));
const statusMessages = new messages_1.default("workspace");
const createWorkspace = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, description } = req.body;
    if (!name || !description) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Name and description are required", "error", "create"), 400, false);
    }
    const workspace = yield workspacesService_1.default.createWorkspace({
        createdBy: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id, // there is a middleware, so req.user is always defined
        name,
        description,
    });
    res.status(201).json({
        success: true,
        message: statusMessages.getMessage("Workspace created", "success", "create"),
        data: workspace,
    });
}));
const getWorkspaceById = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const workspace = yield workspacesService_1.default.getWorkspaceById(id, userId);
    res.status(200).json({ success: true, message: "", data: workspace });
}));
const getMyWorkspaces = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const workspaces = yield workspacesService_1.default.getWorkspaceByCreatorId(userId);
    res.status(200).json({ success: true, message: "", data: workspaces });
}));
const getAllWorkspacesForUser = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // needs optimization
    const workspaces = yield workspacesService_1.default.getAllWorkspacesForUser((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id);
    res.status(200).json({ success: true, message: "", data: workspaces });
}));
const updateWorkspace = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, description } = req.body;
    const createdBy = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const workspace = yield workspacesService_1.default.updateWorkspace(id, createdBy, {
        name,
        description,
    });
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Workspace updated", "success", "update"),
        data: workspace,
    });
}));
const deleteWorkspace = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const createdBy = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const workspace = yield workspacesService_1.default.deleteWorkspace(id, createdBy);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Workspace deleted", "success", "delete"),
        data: workspace,
    });
}));
const sendInviteToJoinWorkspace = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId } = req.params;
    const { email } = req.body;
    const user = req.user;
    if (!user) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Unauthorized", "error", "other"), 401, false);
    }
    const workspace = yield workspacesService_1.default.getWorkspaceById(workspaceId, user._id.toString());
    if (!workspace) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Workspace not found", "error", "other"), 404, false);
    }
    yield (0, mail_1.sendInviteToJoinWorkspaceMail)(email, workspace, user);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Invite sent successfully", "success", "other"),
    });
}));
const getAcceptInvite = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // token validation and verification in middleware
    const { senderId, workspaceId } = req.params;
    if (!senderId || !workspaceId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Bad request", "error", "other"), 404, false);
    }
    const data = yield workspacesService_1.default.getInviteData(workspaceId, senderId);
    res.status(200).json({
        success: true,
        message: "",
        data,
    });
}));
const acceptInvite = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // token validation and verification in middleware
    const { workspaceId } = req.params;
    const user = req.user;
    if (!user || !workspaceId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Bad request", "error", "other"), 404, false);
    }
    yield workspacesService_1.default.addPeople(workspaceId, user._id.toString());
    res.status(201).json({
        success: true,
        message: statusMessages.getMessage("Invite accepted", "success", "other"),
    });
}));
const getPeople = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id: workspaceId } = req.params;
    const people = yield workspacesService_1.default.getPeople(workspaceId, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id);
    res.status(200).json({ success: true, message: "", data: people });
}));
const removePeople = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id: workspaceId } = req.params;
    const { peopleId } = req.body;
    yield workspacesService_1.default.removePeople(workspaceId, peopleId, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("People removed", "success", "other"),
        data: { peopleId, workspaceId },
    });
}));
const workspacesController = {
    createWorkspace,
    getWorkspaceById,
    getMyWorkspaces,
    getAllWorkspacesForUser,
    updateWorkspace,
    deleteWorkspace,
    sendInviteToJoinWorkspace,
    getAcceptInvite,
    acceptInvite,
    getPeople,
    removePeople,
};
exports.default = workspacesController;
