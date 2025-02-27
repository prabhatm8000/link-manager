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
    team: mongoose.Types.ObjectId[];
    teamCount: number;
    isActive: boolean;
}

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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
        team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        teamCount: {
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

workspaceSchema.index({ name: 1 }, { unique: true });
const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);

export default Workspace;
