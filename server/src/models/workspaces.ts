import mongoose from "mongoose";

/**
 * workspace will follow plan of user who created it
 */
export interface IWorkspace extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    // workspace will follow plan of user who created it
    createdBy: mongoose.Types.ObjectId;
    people: mongoose.Types.ObjectId[];
    peopleCount: number;
    linkCount: number;
    isActive: boolean;
}

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
        linkCount: {
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

const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;
