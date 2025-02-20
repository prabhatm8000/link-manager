import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IOtp extends mongoose.Document {
    email: string;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
    compareOtp(otp: string): Promise<boolean>;
}

const otpSchema = new mongoose.Schema<IOtp>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

otpSchema.index({ email: 1 }, { unique: true });

otpSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("otp")) {
        if (!this.otp) {
            return next(new Error("OTP is required before saving"));
        }

        this.otp = await bcrypt.hash(this.otp, 10);
    }
    next();
});

otpSchema.methods.compareOtp = async function (otp: string): Promise<boolean> {
    return await bcrypt.compare(otp, this.otp);
};

const Otp = mongoose.model<IOtp>("Otp", otpSchema);
export default Otp;
