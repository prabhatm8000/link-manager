"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const linkRedirectController_1 = __importDefault(require("../../controllers/linkRedirectController"));
const UAMiddleware_1 = __importDefault(require("../../middlewares/UAMiddleware"));
const linkRedirectRouter = (0, express_1.Router)();
linkRedirectRouter.get("/:shortUrlKey([a-zA-Z0-9]{10})", UAMiddleware_1.default, linkRedirectController_1.default.redirectToDestination);
exports.default = linkRedirectRouter;
