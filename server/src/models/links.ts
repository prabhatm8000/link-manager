import mongoose from "mongoose";
import type { IUser } from "./users";

/**
 * links and related events will follow plan of workspace
 */
export interface ILinks extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    tags: string[];
    destinationUrl: string;
    shortUrlKey: string;
    comment: string;
    creatorId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    isActive: boolean;
    expiresAt?: Date;

    // when populated
    creator?: IUser;
}

const linksSchema = new mongoose.Schema(
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
        shortUrlKey: {
            type: String,
            required: true, 
            unique: true,
        },
        comment: {
            type: String,
        },
        creatorId: {
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

linksSchema.index({ shortUrlKey: 1 }, { unique: true });
const Links = mongoose.model<ILinks>("Links", linksSchema);
export default Links;