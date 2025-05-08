"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventUsageSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    count: { type: Number, required: true },
    month: { type: Date, required: true },
});
// auto delete after 1 year
eventUsageSchema.index({ month: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 });
eventUsageSchema.index({ userId: 1, month: 1 }, { unique: true });
const EventUsage = mongoose_1.default.model("EventUsage", eventUsageSchema);
exports.default = EventUsage;
