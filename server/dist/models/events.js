"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const metadataSchema = new mongoose_1.default.Schema({
    userAgent: { type: String },
    ip: { type: String, required: true },
    browser: { type: String, required: true },
    os: { type: String, required: true },
    device: { type: String, required: true },
    region: { type: String, required: true },
    referer: { type: String, required: true },
}, { _id: false });
const eventsSchema = new mongoose_1.default.Schema({
    linkId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Links",
        required: true,
    },
    workspaceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            "CLICK",
            "QR CODE",
        ],
    },
    metadata: {
        type: metadataSchema,
        required: true,
    },
}, {
    timestamps: true,
});
eventsSchema.index({ workspaceId: 1 });
// auto delete events after 90 days
eventsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
const Events = mongoose_1.default.model("Events", eventsSchema);
exports.default = Events;
