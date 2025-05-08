import mongoose from "mongoose";

const eventUsageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    count: { type: Number, required: true },
    month: { type: Date, required: true },
});

// auto delete after 1 year
eventUsageSchema.index({ month: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });
eventUsageSchema.index({ userId: 1, month: 1 }, { unique: true });

const EventUsage = mongoose.model("EventUsage", eventUsageSchema);
export default EventUsage;