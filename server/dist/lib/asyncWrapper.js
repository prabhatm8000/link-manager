"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncWrapper = (callback) => {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
};
exports.default = asyncWrapper;
