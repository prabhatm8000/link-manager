import StatusMessagesMark4 from "../constants/messages";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { sendInviteToJoinWorkspaceMail } from "../lib/mail";
import workspacesService from "../services/workspacesService";

const statusMessages = new StatusMessagesMark4("workspace");

const createWorkspace = asyncWrapper(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        throw new APIResponseError(statusMessages.getMessage("Name and description are required", "error", "create"), 400, false);
    }

    const workspace = await workspacesService.createWorkspace({
        createdBy: req?.user?._id as string, // there is a middleware, so req.user is always defined
        name,
        description,
    });
    res.status(201).json({
        success: true,
        message: statusMessages.getMessage("Workspace created", "success", "create"),
        data: workspace,
    });
});

const getWorkspaceById = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?._id as string;
    const workspace = await workspacesService.getWorkspaceById(id, userId);
    res.status(200).json({ success: true, message: "", data: workspace });
});

const getMyWorkspaces = asyncWrapper(async (req, res) => {
    const userId = req?.user?._id as string;
    const workspaces = await workspacesService.getWorkspaceByCreatorId(userId);
    res.status(200).json({ success: true, message: "", data: workspaces });
});

const getAllWorkspacesForUser = asyncWrapper(async (req, res) => {
    // needs optimization
    const workspaces = await workspacesService.getAllWorkspacesForUser(
        req?.user?._id as string
    );
    res.status(200).json({ success: true, message: "", data: workspaces });
});

const updateWorkspace = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const createdBy = req?.user?._id as string;
    const workspace = await workspacesService.updateWorkspace(id, createdBy, {
        name,
        description,
    });
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Workspace updated", "success", "update"),
        data: workspace,
    });
});

const deleteWorkspace = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const createdBy = req?.user?._id as string;
    const workspace = await workspacesService.deleteWorkspace(id, createdBy);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Workspace deleted", "success", "delete"),
        data: workspace,
    });
});

const sendInviteToJoinWorkspace = asyncWrapper(async (req, res) => {
    const { workspaceId } = req.params;
    const { email } = req.body;
    const user = req.user;
    if (!user) {
        throw new APIResponseError(statusMessages.getMessage("Unauthorized", "error", "other"), 401, false);
    }

    const workspace = await workspacesService.getWorkspaceById(
        workspaceId,
        user._id.toString()
    );
    if (!workspace) {
        throw new APIResponseError(statusMessages.getMessage("Workspace not found", "error", "other"), 404, false);
    }

    await sendInviteToJoinWorkspaceMail(email, workspace, user);
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Invite sent successfully", "success", "other"),
    });
});

const getAcceptInvite = asyncWrapper(async (req, res) => {
    // token validation and verification in middleware
    const { senderId, workspaceId } = req.params;

    if (!senderId || !workspaceId) {
        throw new APIResponseError(statusMessages.getMessage("Bad request", "error", "other"), 404, false);
    }

    const data = await workspacesService.getInviteData(workspaceId, senderId);

    res.status(200).json({
        success: true,
        message: "",
        data,
    });
});

const acceptInvite = asyncWrapper(async (req, res) => {
    // token validation and verification in middleware
    const { workspaceId } = req.params;
    const user = req.user;

    if (!user || !workspaceId) {
        throw new APIResponseError(statusMessages.getMessage("Bad request", "error", "other"), 404, false);
    }

    await workspacesService.addPeople(workspaceId, user._id.toString());

    res.status(201).json({
        success: true,
        message: statusMessages.getMessage("Invite accepted", "success", "other"),
    });
});

const getPeople = asyncWrapper(async (req, res) => {
    const { id: workspaceId } = req.params;
    const people = await workspacesService.getPeople(workspaceId, req?.user?._id as string);
    res.status(200).json({ success: true, message: "", data: people });
});

const removePeople = asyncWrapper(async (req, res) => {
    const { id: workspaceId } = req.params;
    const { peopleId } = req.body;
    await workspacesService.removePeople(
        workspaceId,
        peopleId,
        req?.user?._id as string
    );
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("People removed", "success", "other"),
        data: { peopleId, workspaceId },
    });
});

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

export default workspacesController;
