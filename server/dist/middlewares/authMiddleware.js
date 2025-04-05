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
const asyncWrapper_1 = require("../lib/asyncWrapper");
const cookie_1 = require("../lib/cookie");
const usersService_1 = __importDefault(require("../services/usersService"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield (0, cookie_1.getAuthCookie)(req);
        const user = yield usersService_1.default.getUserById(payload._id);
        if (!user) {
            throw new response_1.APIResponseError("", 401, false);
        }
        req.user = user;
        delete req.user.password;
        if (next)
            next();
    }
    catch (error) {
        (0, asyncWrapper_1.catchHandler)(error, req, res);
    }
});
exports.default = authMiddleware;
