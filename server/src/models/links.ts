import mongoose from "mongoose";
import type { IUser } from "./users";
import bcrypt from "bcrypt";

/**
 * links and related events will follow plan of workspace
 */
export interface ILinks extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    destinationUrl: string;
    shortUrlKey: string;
    tags: string[];
    comment: string;
    expirationTime?: Date;
    password?: string;

    isActive: boolean;
    workspaceId: mongoose.Types.ObjectId;
    creatorId: mongoose.Types.ObjectId;

    // when populated
    creator?: IUser;
    hasPassword?: boolean;

    // methods
    comparePassword: (password: string) => Promise<boolean>;
}

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
        isActive: {
            type: Boolean,
            default: true,
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
    const link = this;
    if (link.isModified("password") && link.password) {
        link.password = await bcrypt.hash(link.password, 10);
    }
    next();
});

linksSchema.methods.comparePassword = async function (password: string) {
    const link = this as ILinks;
    if (!link.password) {
        throw new Error("Password is not set for this link.");
    }
    return await bcrypt.compare(password, link.password);
};

linksSchema.set("toJSON", {
    transform: (_, ret) => {
        delete ret.password;
        return ret;
    }
});

const Links = mongoose.model<ILinks>("Links", linksSchema);
export default Links;