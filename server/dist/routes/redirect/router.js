"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const linkRedirectRouter_1 = __importDefault(require("./linkRedirectRouter"));
const redirectRouter = (0, express_1.Router)();
redirectRouter.use("/", linkRedirectRouter_1.default);
exports.default = redirectRouter;
