"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const response_1 = require("../errors/response");
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const cookie_1 = require("../lib/cookie");
const users_1 = __importDefault(require("../models/users"));
const authMiddleware = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = yield (0, cookie_1.getAuthCookie)(req);
    const user = yield users_1.default.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(payload._id),
            },
        },
        {
            $lookup: {
                from: "usages",
                localField: "usageId",
                foreignField: "_id",
                as: "usage",
            },
        },
        {
            $unwind: "$usage",
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                profilePicture: 1,
                lastLogin: 1,
                usage: "$usage",
            },
        },
    ]);
    if (user.length === 0) {
        throw new response_1.APIResponseError("", 401, false);
    }
    req.user = user[0];
    next();
}));
exports.default = authMiddleware;
