import mongoose from "mongoose";
import type { ILinkCount, IUsage } from "../types/usage";

const linkCountSchema = new mongoose.Schema<ILinkCount>(
    {
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            unique: true,
        },
        count: { type: Number, required: true },
    },
    { _id: false }
);

const usageSchema = new mongoose.Schema<IUsage>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    subscriptionTier: {
        type: String,
        default: "FREE",
        required: true,
    },
    workspaceCount: { type: Number, required: true },
    linkCount: [linkCountSchema],
});

usageSchema.index({ userId: 1 }, { unique: true });

const Usage = mongoose.model<IUsage>("Usage", usageSchema);
export default Usage;
