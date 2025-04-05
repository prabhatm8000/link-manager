import mongoose from "mongoose";
import type { ITags } from "../types/tag";

const tagsSchema = new mongoose.Schema(
    {
        tags: {
            type: [String],
            default: [],
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

tagsSchema.index({ workspaceId: 1 }, { unique: true });

const Tags = mongoose.model<ITags>("Tags", tagsSchema);
export default Tags;
