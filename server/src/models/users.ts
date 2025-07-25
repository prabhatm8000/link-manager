import bcrypt from "bcrypt";
import mongoose from "mongoose";
import type { IUser } from "../types/user";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 50,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            maxlength: 100,
            minlength: 3,
        },
        // not required for authType: google
        password: {
            type: String,
        },
        authType: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        profilePicture: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        usageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usage",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
    if (this.password && this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        delete returnedObject.password;
        delete returnedObject.usageId;
        return returnedObject;
    },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
