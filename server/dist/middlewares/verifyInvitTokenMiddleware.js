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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envVars_1 = __importDefault(require("../constants/envVars"));
const response_1 = require("../errors/response");
const JWT_SECRET = envVars_1.default.JWT_SECRET;
const verifyInvitTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { senderId, workspaceId, token } = req.params;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded === "string" || !decoded.payload) {
            throw new response_1.APIResponseError("Unauthorized", 401, false);
        }
        if (decoded.payload.workspaceId !== workspaceId ||
            decoded.payload.senderId !== senderId) {
            throw new response_1.APIResponseError("Bad Request", 401, false);
        }
        if (decoded.payload.recipientEmail !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email)) {
            throw new response_1.APIResponseError("Unauthorized", 401, false);
        }
        next();
    }
    catch (error) { }
});
exports.default = verifyInvitTokenMiddleware;
