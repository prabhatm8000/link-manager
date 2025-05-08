import mongoose from "mongoose";
import { APIResponseError } from "../errors/response";
import type { IWorkspace, IWorkspaceModel } from "../types/workspace";

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        people: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        peopleCount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

workspaceSchema.statics.authorized = async function(
    ws: IWorkspace | mongoose.Types.ObjectId | string,
    userId: string,
    checkAll: boolean = true
): Promise<boolean> {
    if (ws instanceof mongoose.Types.ObjectId || typeof ws === "string") {
        const workspace = await this.aggregate([
            {
                $match: {
                    $and: [
                        {
                            _id: new mongoose.Types.ObjectId(ws),
                        },
                        {
                            people: {
                                $in: [new mongoose.Types.ObjectId(userId)],
                            },
                        },
                        {
                            isActive: true,
                        },
                        checkAll
                            ? {
                                  createdBy: new mongoose.Types.ObjectId(
                                      userId
                                  ),
                              }
                            : {},
                    ],
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
        } else if (checkAll && ws.createdBy.toString() !== userId.toString()) {
            throw new APIResponseError(
                "Unauthorized or Workspace not found",
                401,
                false
            );
        }
    }

    return true;
};

const Workspace = mongoose.model<IWorkspace, IWorkspaceModel>(
    "Workspace",
    workspaceSchema
);

export default Workspace;
