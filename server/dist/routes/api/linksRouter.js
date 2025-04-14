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
linksRouter.route("/generate-short-link-key").post(linksController_1.default.generateShortUrlKey);
linksRouter.route("/").post(linksController_1.default.createLink);
linksRouter
    .route("/workspace/:workspaceId")
    .get(linksController_1.default.getLinksByWorkspaceId);
linksRouter.route("/:linkId").get(linksController_1.default.getLinkById);
linksRouter.route("/:linkId").patch(linksController_1.default.updateLink);
linksRouter.route("/:linkId").delete(linksController_1.default.deleteLink);
linksRouter.route("/:linkId/deactivate").patch(linksController_1.default.deactivateLink);
linksRouter.route("/:shortUrlKey").get(linksController_1.default.getLinkByShortUrlKey);
linksRouter.route("/getTagsSuggestions").post(linksController_1.default.tagsSuggestions);
exports.default = linksRouter;
