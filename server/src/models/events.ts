import mongoose from "mongoose";
import { IEvents } from "../types/event";

const metadataSchema = new mongoose.Schema<IEvents["metadata"]>(
    {
        userAgent: { type: String },
        ip: { type: String, required: true },
        browser: { type: String, required: true },
        os: { type: String, required: true },
        device: { type: String, required: true },
        country: { type: String, required: true },
        region: { type: String, required: true },
        city: { type: String, required: true },
        referer: { type: String, required: true },
    },
    { _id: false }
);

const eventsSchema = new mongoose.Schema<IEvents>(
    {
        linkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Links",
            required: true,
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        trigger: {
            type: String,
            required: true,
            enum: [
                "CLICK",
                "QR",
            ],
        },
        metadata: {
            type: metadataSchema,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

eventsSchema.index({ workspaceId: 1 });
// auto delete events after 90 days of creation
eventsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const Events = mongoose.model<IEvents>("Events", eventsSchema);
export default Events;
