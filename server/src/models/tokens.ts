import mongoose from "mongoose";
import type { ITokens } from "../types/tokens";

const tokenSchema = new mongoose.Schema<ITokens>({
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["VERIFICATION", "RESET_PASSWORD"],
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
});

// auto delete after expiry
tokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

const Tokens = mongoose.model<ITokens>("Tokens", tokenSchema);
export default Tokens;