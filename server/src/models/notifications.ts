import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    forCreator: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enums: ["INVITE", "REQUEST"],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
