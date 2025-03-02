import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
    _id: string | mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    profilePicture?: string;
    isActive?: boolean;
    lastLogin?: Date;
    workspaceCreatedCount?: number;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
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
        workspaceCreatedCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
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
    transform: (document, returnedObject) => {
        delete returnedObject.password;
        return returnedObject;
    },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
