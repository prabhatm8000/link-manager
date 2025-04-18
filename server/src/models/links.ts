import bcrypt from "bcrypt";
import mongoose from "mongoose";
import type { ILinks } from "../types/link";

const linksSchema = new mongoose.Schema(
    {
        destinationUrl: {
            type: String,
            required: true,
        },
        shortUrlKey: {
            type: String,
            required: true,
            unique: true,
        },
        metadata: {
            type: {
                title: {
                    type: String,
                },
                description: {
                    type: String,
                },
                favicon: {
                    type: String,
                },
                previewImg: {
                    type: String,
                },
            },
        },
        tags: {
            type: [String],
        },
        comment: {
            type: String,
        },
        expirationTime: {
            type: Date,
        },
        password: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "expired"],
            default: "active",
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

linksSchema.index({ shortUrlKey: 1 }, { unique: true });

linksSchema.pre("save", async function (next) {
    if (this.password && this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

linksSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();

    // Check if password is being updated
    if (update && "password" in update && update.password) {
        const hashed = await bcrypt.hash(update.password, 10);
        this.setUpdate({ ...update, password: hashed });
    }

    next();
});

linksSchema.methods.comparePassword = async function (password: string) {
    if (!this.password) {
        throw new Error("Password is not set for this link.");
    }
    return await bcrypt.compare(password, this.password);
};

linksSchema.set("toJSON", {
    transform: (_, ret) => {
        // delete ret.password;
        ret.hasPassword = !!ret.password;
        return ret;
    },
});

const Links = mongoose.model<ILinks>("Links", linksSchema);
export default Links;
