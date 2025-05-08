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
const response_1 = require("../errors/response");
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const usageService_1 = __importDefault(require("../services/usageService"));
const getUsage = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const workspaceId = req.query.wsId;
    if (!user) {
        throw new Error("User not found"); // This should never happen
    }
    if (!workspaceId) {
        throw new response_1.APIResponseError("Workspace ID is required", 400, false);
    }
    const usage = yield usageService_1.default.getUsageData(user._id.toString(), workspaceId);
    res.status(200).json({ success: true, message: "", data: usage });
}));
const usageController = {
    getUsage,
};
exports.default = usageController;
