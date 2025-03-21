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
    let workspace: IWorkspace | null = null;
    try {    
        if (typeof ws === "string" || ws instanceof mongoose.Types.ObjectId) {
            workspace = await Workspace.findOne({
                _id: new mongoose.Types.ObjectId(ws),
            }); // will automatically throw error for invlaid id
        } else {
            workspace = ws;
        }
    } catch (error: any) {
        // probably invalid id
        throw new APIResponseError("Invalid id", 400, false);
    }

    if (!workspace) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

    // length of array will not be more than 20, (as of now)
    const peopleIds = workspace.people.map((person) => person.toString());
    if (!peopleIds.includes(userId)) {
        throw new APIResponseError("Unauthorized", 401, false);
    }
    return true;
};

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

const getWorkspaceById = async (workspaceId: string, userId: string) => {
    await authorized(workspaceId, userId);

    const result = await Workspace.aggregate([
        {
            $match: {
                $and: [
                    // {
                    //     $or: [
                    //         {
                    //             people: {
                    //                 $in: [new mongoose.Types.ObjectId(userId)],
                    //             },
                    //         },
                    //         { createdBy: new mongoose.Types.ObjectId(userId) },
                    //     ],
                    // },
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
    validateObjectId(userId);
    const result = await Workspace.find({
        createdBy: new mongoose.Types.ObjectId(userId),
        isActive: true,
    });
    return result;
};

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

const removePeople = async (
    workspaceId: string,
    peopleId: string,
    userId: string
) => {
    validateObjectId(workspaceId, peopleId, userId);
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
