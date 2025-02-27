import mongoose from "mongoose";
import { APIResponseError } from "../errors/response";
import User from "../models/users";
import Workspace from "../models/workspaces";

const MAX_WORKSPACES = 5;
const MAX_TEAM_MEMBERS = 20;

const createWorkspace = async (workspace: {
    name: string;
    description: string;
    createdBy: string;
}) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const user = await User.findById(workspace.createdBy);
        const workspaceCreatedCount = user?.workspaceCreatedCount;
        if (!workspaceCreatedCount) {
            throw new APIResponseError("Something went wrong", 404, false);
        }

        if (workspaceCreatedCount >= MAX_WORKSPACES) {
            throw new APIResponseError(
                `A user can only create ${MAX_WORKSPACES} workspaces`,
                400,
                false
            );
        }

        const newWorkspace = await Workspace.create({
            name: workspace.name,
            description: workspace.description,
            createdBy: new mongoose.Types.ObjectId(workspace.createdBy),
            team: [],
            $session: session,
        });

        user.workspaceCreatedCount = workspaceCreatedCount + 1;
        await user.save({ session });

        await session.commitTransaction();
        return newWorkspace;
    } catch (error: any) {
        await session.abortTransaction();

        if (error?.name === "MongoServerError" && error?.code === 11000) {
            throw new APIResponseError(
                "Workspace name already exists",
                400,
                false
            );
        }
        throw error;
    }
};

const getWorkspaceById = async (workspaceId: string, userId: string) => {
    const result = await Workspace.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {
                                team: {
                                    $in: [new mongoose.Types.ObjectId(userId)],
                                },
                            },
                            { createdBy: new mongoose.Types.ObjectId(userId) },
                        ],
                    },
                    { _id: new mongoose.Types.ObjectId(workspaceId) },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "team",
                foreignField: "_id",
                as: "teamDetails",
            },
        },
        {
            $project: {
                "teamDetails.name": 1,
                "teamDetails.email": 1,
                "teamDetails._id": 1,
                "teamDetails.profilePicture": 1,
                name: 1,
                description: 1,
                createdBy: 1,
                isActive: 1,
            },
        },
    ]);

    if (result.length === 0) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    return result[0];
};

const getWorkspaceByCreatorId = async (userId: string) => {
    const result = await Workspace.find({
        createdBy: new mongoose.Types.ObjectId(userId),
        isActive: true,
    });
    return result;
};

const getAllWorkspacesForUser = async (userId: string) => {
    const result = await Workspace.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {
                                team: {
                                    $in: [new mongoose.Types.ObjectId(userId)],
                                },
                            },
                            { createdBy: new mongoose.Types.ObjectId(userId) },
                        ],
                    },
                    { isActive: true },
                ],
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdBy: 1,
                isActive: 1,
            },
        },
    ]);

    return result;
};

const updateWorkspace = async (
    workspaceId: string,
    createdBy: string,
    data: { name: string; description: string }
) => {
    return await Workspace.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(workspaceId), createdBy: createdBy },
        { $set: data },
        { new: true }
    );
};

const deleteWorkspace = async (workspaceId: string, createdBy: string) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await Workspace.findOneAndDelete(
            {
                _id: new mongoose.Types.ObjectId(workspaceId),
                createdBy: new mongoose.Types.ObjectId(createdBy),
            },
            { session }
        );
        await User.findByIdAndUpdate(
            createdBy,
            { $inc: { workspaceCreatedCount: -1 } },
            { session }
        );
        await session.commitTransaction();
        if (!result) {
            throw new APIResponseError("Workspace not found", 404, false);
        }
        return result;
    } catch (error: any) {
        await session.abortTransaction();
        if (error?.name === "MongoServerError" && error?.code === 11000) {
            throw new APIResponseError(
                "Workspace name already exists",
                400,
                false
            );
        }
        throw error;
    }
};

const addTeamMember = async (workspaceId: string, userId: string) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    if (workspace.teamCount >= MAX_TEAM_MEMBERS) {
        throw new APIResponseError(
            "Maximum number of team members reached",
            400,
            false
        );
    }

    const result = await Workspace.updateOne(
        { _id: workspaceId },
        {
            $addToSet: { team: new mongoose.Types.ObjectId(userId) },
            $inc: { teamCount: 1 },
        }
    );

    return result;
};

const getTeamMembers = async (workspaceId: string) => {
    const result = await Workspace.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(workspaceId) } },
        {
            $lookup: {
                from: "users",
                localField: "team",
                foreignField: "_id",
                as: "teamDetails",
            },
        },
        {
            $project: {
                "teamDetails.name": 1,
                "teamDetails.email": 1,
                "teamDetails._id": 1,
                "teamDetails.profilePicture": 1,
                name: 1,
                description: 1,
                createdBy: 1,
                isActive: 1,
            },
        },
    ]);

    if (result.length === 0) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    return result;
};

const removeTeamMember = async (workspaceId: string, userId: string) => {
    const result = await Workspace.updateOne(
        { _id: workspaceId },
        {
            $pull: { team: new mongoose.Types.ObjectId(userId) },
            $inc: { teamCount: -1 },
        }
    );

    if (result.matchedCount === 0) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    return result;
};

const workspacesService = {
    createWorkspace,
    getWorkspaceById,
    getWorkspaceByCreatorId,
    getAllWorkspacesForUser,
    updateWorkspace,
    deleteWorkspace,
    addTeamMember,
    getTeamMembers,
    removeTeamMember,
};

export default workspacesService;
