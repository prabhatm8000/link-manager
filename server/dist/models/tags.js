"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tagsSchema = new mongoose_1.default.Schema({
    tags: {
        type: [String],
        default: [],
    },
    workspaceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
        unique: true,
    },
}, { timestamps: true });
tagsSchema.index({ workspaceId: 1 }, { unique: true });
const Tags = mongoose_1.default.model("Tags", tagsSchema);
exports.default = Tags;
