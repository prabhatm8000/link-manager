import type mongoose from "mongoose";

export type TokenTypes = "VERIFICATION" | "RESET_PASSWORD";

export interface ITokens extends mongoose.Document {
    token: string;
    type: TokenTypes;
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
}

export interface ITokensService {
    create: (token: string, type: TokenTypes, userId: string) => Promise<void>;
    get: (token: string, type: TokenTypes) => Promise<ITokens | null>;
}