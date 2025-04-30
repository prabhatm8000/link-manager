import mongoose, { Schema } from "mongoose";
import type { IAnalytics, INameCount } from "../types/analytics";

const nameCountSchema = new Schema<INameCount>(
    {
        name: { type: String, required: true },
        count: { type: Number, required: true },
    },
    { _id: false }
);

const analyticsSchema = new Schema<IAnalytics>(
    {
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        linkId: {
            type: Schema.Types.ObjectId,
            ref: "Links",
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        total: { type: Number, default: 0 },
        region: [nameCountSchema],
        browser: [nameCountSchema],
        os: [nameCountSchema],
        device: [nameCountSchema],
    },
    { timestamps: true }
);

// storing 1 doc for each link per day, help with analytics
analyticsSchema.index({ linkId: 1, date: 1 }, { unique: true });

const Analytics = mongoose.model<IAnalytics>("Analytics", analyticsSchema);
export default Analytics;
