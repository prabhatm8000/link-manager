import mongoose from "mongoose";
import { getQuotaFor } from "../constants/quota";
import { APIResponseError } from "../errors/response";
import { matchObjectId, validateObjectId } from "../lib/mongodb";
import Usage from "../models/usage";
import User from "../models/users";
import Workspace from "../models/workspaces";
import type { IUser } from "../types/user";
import type { IWorkspaceService } from "../types/workspace";
import analyticsService from "./analyticsService";
import eventsService from "./eventsService";
import linksService from "./linksService";
import usageService from "./usageService";

/**
 * [user is already authenticated]
 * @param workspace
 * @returns
 */
const createWorkspace = async (
    workspace: {
        name: string;
        description: string;
    },
    user: IUser
) => {
    const MAX_WORKSPACES = getQuotaFor(
        "WORKSPACES",
        user.usage?.subscriptionTier
    );
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const workspaceCreatedCount = user.usage?.workspaceCount;
        if (!user || workspaceCreatedCount === undefined) {
            throw new APIResponseError("Something went wrong", 404, false);
        }

        if (workspaceCreatedCount >= MAX_WORKSPACES) {
            throw new APIResponseError(
                `Quota of ${MAX_WORKSPACES} workspaces reached!`,
                400,
                false
            );
        }

        const newWorkspace = new Workspace({
            name: workspace.name,
            description: workspace.description,
            createdBy: new mongoose.Types.ObjectId(user._id),
            people: [new mongoose.Types.ObjectId(user._id)],
        });

        await newWorkspace.save({
            session,
        });
        await usageService.incrementWorkspaceCount(
            { userId: user._id.toString() },
            { session }
        );

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
                linkCount: 1,
            },
        },
    ]);

    const workspace = result[0];
    if (!workspace) {
        throw new APIResponseError("Workspace not found", 404, false);
    }

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
const deleteWorkspace = async (
    workspaceId: string,
    createdBy: string,
    options?: {
        session?: mongoose.ClientSession;
    }
) => {
    validateObjectId(workspaceId, createdBy);
    let session = options?.session
        ? options.session
        : await mongoose.startSession();
    try {
        if (!options?.session) session.startTransaction();

        const result = await Workspace.findOneAndDelete(
            {
                _id: new mongoose.Types.ObjectId(workspaceId),
                createdBy: new mongoose.Types.ObjectId(createdBy),
            },
            { session }
        );
        if (!result) {
            throw new APIResponseError("Workspace not found", 404, false);
        }

        // delete links
        const linksDeleteCount = await linksService.deleteAllLinksByWorkspaceId(
            workspaceId,
            createdBy,
            {
                session,
            }
        );

        await Promise.all([
            // count updation
            await usageService.updateAll(
                {
                    userId: createdBy,
                    workspaceId,
                    workspaceCountBy: -1,
                    linkCountBy: -(linksDeleteCount),
                },
                { session }
            ),
            // delete events
            await eventsService.deleteEventsBy(
                { workspaceId: workspaceId },
                { session }
            ),
            // delete analytics
            await analyticsService.deleteAnalyticsBy(
                { workspaceId: workspaceId },
                { session }
            ),
        ]);

        if (!options?.session) await session.commitTransaction();
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
 * @param peopleId
 * @param user
 * @returns
 */
const addPeople = async (workspaceId: string, peopleId: string) => {
    validateObjectId(workspaceId, peopleId);
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new APIResponseError("Workspace not found", 404, false);
    }
    const userUsage = await Usage.findOne({
        userId: new mongoose.Types.ObjectId(workspace.createdBy),
    });
    if (!userUsage) {
        throw new Error("userUsage fot creator not found");
    }

    const MAX_PEOPLE = getQuotaFor("PEOPLE", userUsage.subscriptionTier);
    if (workspace.peopleCount >= MAX_PEOPLE) {
        throw new APIResponseError("Maximum number reached", 400, false);
    }

    const result = await Workspace.updateOne(
        { _id: workspaceId },
        {
            $addToSet: { people: new mongoose.Types.ObjectId(peopleId) },
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
                    { _id: new mongoose.Types.ObjectId(workspaceId) },
                ],
            },
        },
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

    if (!result.length) {
        throw new APIResponseError(
            "Workspace not found or unauthorized",
            404,
            false
        );
    }

    return result[0].people;
};

/**
 * authentication required, [checks userId in createdBy with authorized]
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
    if (matchObjectId(peopleId, userId)) {
        throw new APIResponseError("You cannot remove yourself", 400, false);
    }

    await Workspace.authorized(workspaceId, userId);
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
            id: senderDetails._id.toString(),
            name: senderDetails.name,
            email: senderDetails.email,
            profilePicture: senderDetails.profilePicture,
        },
    };
};

const workspacesService: IWorkspaceService = {
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
