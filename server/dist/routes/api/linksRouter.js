"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const linksController_1 = __importDefault(require("../../controllers/linksController"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const linksRouter = (0, express_1.Router)();
linksRouter.use(authMiddleware_1.default);
linksRouter.post("/generate-short-link-key", linksController_1.default.generateShortUrlKey);
linksRouter.get("/metadata", linksController_1.default.getMetadata);
linksRouter.post("/", linksController_1.default.createLink);
linksRouter
    .get("/workspace/:workspaceId", linksController_1.default.getLinksByWorkspaceId);
linksRouter.get("/:linkId", linksController_1.default.getLinkById);
linksRouter.patch("/:linkId", linksController_1.default.updateLink);
linksRouter.delete("/:linkId", linksController_1.default.deleteLink);
linksRouter.patch("/:linkId/deactivate", linksController_1.default.deactivateLink);
linksRouter.get("/:shortUrlKey", linksController_1.default.getLinkByShortUrlKey);
linksRouter.post("/getTagsSuggestions", linksController_1.default.tagsSuggestions);
exports.default = linksRouter;
