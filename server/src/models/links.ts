import mongoose from "mongoose";

/**
 * link and related events will follow plan of workspace
 */
export interface ILink extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    tags: string[];
    destinationUrl: string;
    shortLink: string;
    comments: string[];
    createdId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    isActive: boolean;
    expiresAt?: Date;
}

const linkSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
        },
        destinationUrl: {
            type: String,
            required: true,
        },
        shortLink: {
            type: String,
            required: true, 
            unique: true,
        },
        createdId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

linkSchema.index({ shortLink: 1 }, { unique: true });
const Link = mongoose.model<ILink>("Link", linkSchema);
export default Link;