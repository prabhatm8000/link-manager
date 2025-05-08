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
const messages_1 = __importDefault(require("../constants/messages"));
const response_1 = require("../errors/response");
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const urlMetadeta_1 = require("../lib/urlMetadeta");
const linksService_1 = __importDefault(require("../services/linksService"));
const tagsService_1 = __importDefault(require("../services/tagsService"));
const statusMessages = new messages_1.default("link");
const generateShortUrlKey = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { size } = req.body;
    const ShortUrlKey = yield linksService_1.default.generateShortUrlKey(size);
    res.status(200).json({
        success: true,
        message: "",
        data: ShortUrlKey,
    });
}));
const getMetadata = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
        throw new response_1.APIResponseError("", 400, false);
    }
    const metadata = yield (0, urlMetadeta_1.fetchMetadata)(url);
    res.status(200).json({
        message: "",
        success: true,
        data: metadata,
    });
}));
const createLink = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { tags, destinationUrl, metadata, shortUrlKey, workspaceId, comment, expirationTime, password, } = req.body;
    if (!tags || !destinationUrl || !shortUrlKey || !workspaceId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("All fields are required", "error", "create"), 400, false);
    }
    const link = yield linksService_1.default.createLink({
        destinationUrl,
        shortUrlKey,
        metadata,
        tags,
        comment,
        expirationTime,
        password,
        workspaceId,
        creatorId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "", // can't be undefined
    }, req.user);
    res.status(201).json({
        success: true,
        message: statusMessages.getMessage("Link created successfully", "success", "create"),
        data: link,
    });
}));
const getLinkByShortUrlKey = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { shortUrlKey, workspaceId } = req.params;
    if (!shortUrlKey) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Short URL key is required", "error", "other"), 400, false);
    }
    const link = yield linksService_1.default.getOneLinkBy({
        shortUrlKey,
        userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "",
        workspaceId,
    });
    res.status(200).json({
        success: true,
        message: "",
        data: link,
    });
}));
const getLinksByWorkspaceId = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { workspaceId } = req.params;
    const q = req.query.q;
    if (!workspaceId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Workspace ID is required", "error", "other"), 400, false);
    }
    const links = yield linksService_1.default.getLinksByWorkspaceId(workspaceId, ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "", q);
    res.status(200).json({
        success: true,
        message: "",
        data: links,
    });
}));
const getLinkById = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { linkId, workspaceId } = req.params;
    if (!linkId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Link ID is required", "error", "other"), 400, false);
    }
    const link = yield linksService_1.default.getOneLinkBy({
        linkId,
        userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "",
        workspaceId,
    });
    res.status(200).json({
        success: true,
        message: "",
        data: link,
    });
}));
const updateLink = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { linkId } = req.params;
    if (!linkId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Link ID is required", "error", "update"), 400, false);
    }
    const link = yield linksService_1.default.updateLink(linkId, req.body, ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "");
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Link updated successfully", "success", "update"),
        data: link,
    });
}));
const deactivateLink = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { linkId, status } = req.params;
    if (!linkId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Link ID is required", "error", "other"), 400, false);
    }
    const link = yield linksService_1.default.changeStatus(linkId, status, ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "");
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Link deactivated successfully", "success", "other"),
        data: link,
    });
}));
const deleteLink = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { linkId } = req.params;
    if (!linkId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Link ID is required", "error", "other"), 400, false);
    }
    const link = yield linksService_1.default.deleteLink(linkId, ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "");
    res.status(200).json({
        success: true,
        message: statusMessages.getMessage("Link deleted successfully", "success", "other"),
        data: link,
    });
}));
const tagsSuggestions = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workspaceId, q } = req.body;
    if (!workspaceId) {
        throw new response_1.APIResponseError(statusMessages.getMessage("Workspace ID is required", "error", "other"), 400, false);
    }
    const suggestions = yield tagsService_1.default.searchTags(workspaceId, q);
    res.status(200).json({
        success: true,
        message: "",
        data: suggestions,
    });
}));
const linksController = {
    generateShortUrlKey,
    getMetadata,
    createLink,
    getLinkByShortUrlKey,
    getLinksByWorkspaceId,
    getLinkById,
    updateLink,
    deactivateLink,
    deleteLink,
    tagsSuggestions,
};
exports.default = linksController;
