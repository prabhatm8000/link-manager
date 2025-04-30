"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiErrorHandler = exports.APIResponseError = void 0;
const messages_1 = __importDefault(require("../constants/messages"));
class APIResponseError extends Error {
    constructor(message, status = 500, success = false) {
        super(typeof message === "string" ? message : message.description);
        this.status = status;
        this.success = success;
    }
}
exports.APIResponseError = APIResponseError;
const statusMessages = new messages_1.default();
const apiErrorHandler = (error, req, res, next) => {
    if (error instanceof APIResponseError) {
        res.status(error.status).json({
            success: error.success,
            message: error.message,
        });
    }
    else {
        console.log(req.url, error);
        res.status(500).json({
            success: false,
            message: statusMessages.getRandomInternalServerErrorMessage(),
        });
    }
};
exports.apiErrorHandler = apiErrorHandler;
