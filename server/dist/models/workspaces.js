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
const workspaceSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    people: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    peopleCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
workspaceSchema.statics.authorized = function (ws_1, userId_1) {
    return __awaiter(this, arguments, void 0, function* (ws, userId, checkAll = true) {
        if (ws instanceof mongoose_1.default.Types.ObjectId || typeof ws === "string") {
            const workspace = yield this.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                _id: new mongoose_1.default.Types.ObjectId(ws),
                            },
                            {
                                people: {
                                    $in: [new mongoose_1.default.Types.ObjectId(userId)],
                                },
                            },
                            {
                                isActive: true,
                            },
                            checkAll
                                ? {
                                    createdBy: new mongoose_1.default.Types.ObjectId(userId),
                                }
                                : {},
                        ],
                    },
                },
                {
                    $project: {
                        _id: 1,
                    },
                },
            ]);
            if (workspace.length === 0) {
                throw new response_1.APIResponseError("Unauthorized or Workspace not found", 401, false);
            }
        }
        else {
            // if ws is an instance of Workspace [don't fetch from db]
            const peopleIds = ws.people.map((p) => p.toString());
            if (!peopleIds.includes(userId.toString())) {
                throw new response_1.APIResponseError("Unauthorized or Workspace not found", 401, false);
            }
            else if (checkAll && ws.createdBy.toString() !== userId.toString()) {
                throw new response_1.APIResponseError("Unauthorized or Workspace not found", 401, false);
            }
        }
        return true;
    });
};
const Workspace = mongoose_1.default.model("Workspace", workspaceSchema);
exports.default = Workspace;
