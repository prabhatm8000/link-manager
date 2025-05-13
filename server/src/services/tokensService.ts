import mongoose from "mongoose";
import { APIResponseError } from "../errors/response";
import Tokens from "../models/tokens";
import type { ITokensService, TokenTypes } from "../types/tokens";

const tokensService: ITokensService = {
    create: async (token: string, type: TokenTypes, userId: string) => {
        const existingToken = await Tokens.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            type,
        })
        if (existingToken) 
            throw new APIResponseError("Too soon, mail already sent", 400, false);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 20);
        await Tokens.updateOne(
            {
                userId: new mongoose.Types.ObjectId(userId),
                type,
            },
            {
                $set: { token, type, userId, expiresAt },
            },
            {
                upsert: true,
                new: true,
            }
        );
    },
    get: async (userId: string, type: TokenTypes) => {
        return await Tokens.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            type,
        });
    },
};
export default tokensService;
