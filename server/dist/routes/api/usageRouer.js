"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usageController_1 = __importDefault(require("../../controllers/usageController"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const usageRouter = (0, express_1.Router)();
usageRouter.use(authMiddleware_1.default);
usageRouter.get("/", usageController_1.default.getUsage);
exports.default = usageRouter;
