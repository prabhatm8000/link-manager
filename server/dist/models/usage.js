"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const linkCountSchema = new mongoose_1.default.Schema({
    workspaceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
        unique: true,
    },
    count: { type: Number, required: true },
}, { _id: false });
const usageSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const Usage = mongoose_1.default.model("Usage", usageSchema);
exports.default = Usage;
