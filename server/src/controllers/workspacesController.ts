import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { sendInviteToJoinWorkspaceMail } from "../lib/mail";
import workspacesService from "../services/workspacesService";

const createWorkspace = asyncWrapper(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        throw new APIResponseError("Missing required fields", 400, false);
    }

    const workspace = await workspacesService.createWorkspace({
        createdBy: req?.user?._id as string, // there is a middleware, so req.user is always defined
        name,
        description,
    });
    res.status(201).json({
        success: true,
        message: "Workspace created successfully",
        data: workspace,
    });
});

const getWorkspaceById = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const userId = req?.user?._id as string;
    const workspace = await workspacesService.getWorkspaceById(id, userId);
    res.status(200).json({ success: true, message: "", data: workspace });
});

const getWorkspaceByCreatorId = asyncWrapper(async (req, res) => {
    const userId = req?.user?._id as string;
    const workspaces = await workspacesService.getWorkspaceByCreatorId(userId);
    res.status(200).json({ success: true, message: "", data: workspaces });
});

const getAllWorkspacesForUser = asyncWrapper(async (req, res) => {
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
        message: "Workspace updated successfully",
        data: workspace,
    });
});

const deleteWorkspace = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const createdBy = req?.user?._id as string;
    const workspace = await workspacesService.deleteWorkspace(id, createdBy);
    res.status(200).json({
        success: true,
        message: "Workspace deleted successfully",
        data: workspace,
    });
});

const sendInviteToJoinWorkspace = asyncWrapper(async (req, res) => {
    const { workspaceId } = req.params;
    const { email } = req.body;
    const user = req.user;
    if (!user) {
        throw new APIResponseError("Unauthorized", 401, false);
    }

    const workspace = await workspacesService.getWorkspaceById(
        workspaceId,
        user._id.toString()
    );
    if (!workspace) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    await sendInviteToJoinWorkspaceMail(email, workspace, user);
    res.status(200).json({
        success: true,
        message: "Invite sent successfully",
    });
});

const getAcceptInvite = asyncWrapper(async (req, res) => {
    // token validation and verification in middleware
    const { senderId, workspaceId } = req.params;

    if (!senderId || !workspaceId) {
        throw new APIResponseError("Bad request", 404, false);
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
        throw new APIResponseError("Bad request", 404, false);
    }

    await workspacesService.addTeamMember(workspaceId, user._id.toString());

    res.status(201).json({
        success: true,
        message: "Invite accepted successfully",
    });
});

const getTeamMembers = asyncWrapper(async (req, res) => {
    const { id: workspaceId } = req.params;
    const members = await workspacesService.getTeamMembers(workspaceId);
    res.status(200).json({ success: true, message: "", data: members });
});

const removeTeamMember = asyncWrapper(async (req, res) => {
    const { id: workspaceId } = req.params;
    const { memberId } = req.body;
    await workspacesService.removeTeamMember(
        workspaceId,
        memberId,
        req?.user?._id as string
    );
    res.status(200).json({
        success: true,
        message: "Member removed",
        data: { memberId, workspaceId },
    });
});

const workspacesController = {
    createWorkspace,
    getWorkspaceById,
    getWorkspaceByCreatorId,
    getAllWorkspacesForUser,
    updateWorkspace,
    deleteWorkspace,
    sendInviteToJoinWorkspace,
    getAcceptInvite,
    acceptInvite,
    getTeamMembers,
    removeTeamMember,
};

export default workspacesController;
