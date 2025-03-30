import mongoose from "mongoose";
import { APIResponseError } from "../errors/response";
import { validateObjectId } from "../lib/mongodb";
import User from "../models/users";
import Workspace, { type IWorkspace } from "../models/workspaces";

// limits for a user
const MAX_WORKSPACES = 5;
const MAX_PEOPLE = 20;


/**
 * check if user is authorized to perform action on workspace
 * @param ws
 * @param userId
 * @returns
 */
const authorized = async (
    ws: IWorkspace | mongoose.Types.ObjectId | string,
    userId: string
): Promise<boolean> => {
    if (ws instanceof mongoose.Types.ObjectId || typeof ws === "string") {
        const workspace = await Workspace.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(ws),
                    people: { $in: [new mongoose.Types.ObjectId(userId)] },
                },
            },
            {
                $project: {
                    _id: 1,
                },
            },
        ]);

        if (workspace.length === 0) {
            throw new APIResponseError(
                "Unauthorized or Workspace not found",
                401,
                false
            );
        }
    } else {
        // if ws is an instance of Workspace [don't fetch from db]
        const peopleIds = ws.people.map((p) => p.toString());
        if (!peopleIds.includes(userId.toString())) {
            throw new APIResponseError(
                "Unauthorized or Workspace not found",
                401,
                false
            );
        }
    }

    return true;
};


/**
 * 
 * @param workspace 
 * @returns 
 */
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
        if (!user || workspaceCreatedCount === undefined) {
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
            people: [new mongoose.Types.ObjectId(workspace.createdBy)],
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


/**
 * authentication required, [checks userId in people]
 * @param workspaceId
 * @param userId
 * @returns workspace
 */
const getWorkspaceById = async (workspaceId: string, userId: string) => {
    const result = await Workspace.aggregate([
        {
            $match: {
                $and: [
                    { _id: new mongoose.Types.ObjectId(workspaceId) },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "people",
                foreignField: "_id",
                as: "peopleDetails",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdByDetails",
            },
        },
        {
            $unwind: "$createdByDetails",
        },
        {
            $project: {
                "peopleDetails.name": 1,
                "peopleDetails.email": 1,
                "peopleDetails._id": 1,
                "peopleDetails.profilePicture": 1,
                "createdByDetails.name": 1,
                "createdByDetails.email": 1,
                "createdByDetails._id": 1,
                "createdByDetails.profilePicture": 1,
                people: 1,
                name: 1,
                description: 1,
                createdBy: 1,
                isActive: 1,
            },
        },
    ]);

    const workspace = result[0];
    if (!workspace) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    await authorized(workspace, userId);
    return workspace;
};


/**
 * authentication required, [checks userId in createdBy]
 * @param userId 
 * @returns 
 */
const getWorkspaceByCreatorId = async (userId: string) => {
    validateObjectId(userId);
    const result = await Workspace.find({
        createdBy: new mongoose.Types.ObjectId(userId),
        isActive: true,
    });
    return result;
};


/**
 * authentication required, [checks userId in people or createdBy]
 * @param userId 
 * @returns 
 */
const getAllWorkspacesForUser = async (userId: string) => {
    validateObjectId(userId);
    const result = await Workspace.aggregate([
        {
            $match: {
                $and: [
                    {
                        $or: [
                            {
                                people: {
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


/**
 * authentication required, [checks userId in createdBy]
 * @param workspaceId 
 * @param createdBy 
 * @param data 
 * @returns 
 */
const updateWorkspace = async (
    workspaceId: string,
    createdBy: string,
    data: { name: string; description: string }
) => {
    validateObjectId(workspaceId);
    return await Workspace.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(workspaceId), createdBy: createdBy },
        { $set: data },
        { new: true }
    );
};


/**
 * authentication required, [checks userId in createdBy]
 * @param workspaceId 
 * @param createdBy 
 * @returns 
 */
const deleteWorkspace = async (workspaceId: string, createdBy: string) => {
    validateObjectId(workspaceId, createdBy);
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


/**
 * authentication not required, [checked at controller level]
 * @param workspaceId 
 * @param userId 
 * @returns 
 */
const addPeople = async (workspaceId: string, userId: string) => {
    validateObjectId(workspaceId, userId);
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    if (workspace.peopleCount >= MAX_PEOPLE) {
        throw new APIResponseError("Maximum number reached", 400, false);
    }

    const result = await Workspace.updateOne(
        { _id: workspaceId },
        {
            $addToSet: { people: new mongoose.Types.ObjectId(userId) },
            $inc: { peopleCount: 1 },
        }
    );

    return result;
};


/**
 * authentication required, [checks userId in people]
 * @param workspaceId 
 * @param userId 
 * @returns 
 */
const getPeople = async (workspaceId: string, userId: string) => {
    await authorized(workspaceId, userId);
    const result = await Workspace.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(workspaceId) } },
        {
            $lookup: {
                from: "users",
                localField: "people",
                foreignField: "_id",
                as: "people",
            },
        },
        {
            $project: {
                "people.name": 1,
                "people.email": 1,
                "people._id": 1,
                "people.profilePicture": 1,
            },
        },
    ]);

    if (result.length === 0) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    return result[0];
};


/**
 * authentication required, [checks userId in createdBy]
 * @param workspaceId 
 * @param peopleId 
 * @param userId 
 * @returns 
 */
const removePeople = async (
    workspaceId: string,
    peopleId: string,
    userId: string
) => {
    validateObjectId(workspaceId, peopleId, userId);
    if (userId === peopleId) {
        throw new APIResponseError("You cannot remove yourself", 400, false);
    }
    await authorized(workspaceId, userId);
    const result = await Workspace.updateOne(
        { _id: workspaceId, createdBy: userId },
        {
            $pull: { people: new mongoose.Types.ObjectId(peopleId) },
            $inc: { peopleCount: -1 },
        }
    );

    if (result.matchedCount === 0) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    return result;
};


/**
 * authentication not required, [checked at controller level]
 * @param workspaceId 
 * @param senderId 
 * @returns 
 */
const getInviteData = async (workspaceId: string, senderId: string) => {
    validateObjectId(workspaceId);
    validateObjectId(senderId);
    const result = await Workspace.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(workspaceId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdByDetails",
            },
        },
        {
            $unwind: "$createdByDetails",
        },
        {
            $project: {
                "createdByDetails.name": 1,
                "createdByDetails.email": 1,
                "createdByDetails._id": 1,
                "createdByDetails.profilePicture": 1,
                name: 1,
                description: 1,
                createdBy: 1,
            },
        },
    ]);

    const workspace = result[0];

    if (!workspace) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    const senderDetails = await User.findById(senderId);
    if (!senderDetails) {
        throw new APIResponseError("User not found", 404, false);
    }

    return {
        workspace,
        senderDetails: {
            _id: senderDetails._id,
            name: senderDetails.name,
            email: senderDetails.email,
            profilePicture: senderDetails.profilePicture,
        },
    };
};

const workspacesService = {
    authorized,
    createWorkspace,
    getWorkspaceById,
    getWorkspaceByCreatorId,
    getAllWorkspacesForUser,
    updateWorkspace,
    deleteWorkspace,
    addPeople,
    getPeople,
    removePeople,
    getInviteData,
};

export default workspacesService;
