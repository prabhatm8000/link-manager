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
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchHandler = void 0;
const response_1 = require("../errors/response");
const asyncWrapper = (callback) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield callback(req, res, next);
            if (next)
                next();
        }
        catch (error) {
            console.log(callback.name);
            (0, exports.catchHandler)(error, res);
        }
    });
};
const catchHandler = (error, res) => {
    if (error instanceof response_1.APIResponseError) {
        res.status(error.status).json({
            success: error.success,
            message: error.message,
        });
    }
    else {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.catchHandler = catchHandler;
exports.default = asyncWrapper;
