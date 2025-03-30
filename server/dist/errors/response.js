"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIResponseError = void 0;
class APIResponseError extends Error {
    constructor(message, status = 500, success = false) {
        super(message);
        this.status = status;
        this.success = success;
    }
}
exports.APIResponseError = APIResponseError;
