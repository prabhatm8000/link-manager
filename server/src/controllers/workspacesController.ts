import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
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

const addTeamMember = asyncWrapper(async (req, res) => {
    const { workspaceId, email } = req.body;
    await workspacesService.addTeamMember(workspaceId, email);
    res.status(200).json({
        success: true,
        message: "Team member added successfully",
        data: null,
    });
});

const workspacesController = {
    createWorkspace,
    getWorkspaceById,
    getWorkspaceByCreatorId,
    getAllWorkspacesForUser,
    updateWorkspace,
    deleteWorkspace,
};

export default workspacesController;
