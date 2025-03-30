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
const linksService_1 = __importDefault(require("../services/linksService"));
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const response_1 = require("../errors/response");
const generateShortLinkKey = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { size } = req.body;
    const shortLinkKey = yield linksService_1.default.generateShortLinkKey(size);
    res.status(200).json({
        success: true,
        message: "",
        data: shortLinkKey,
    });
}));
const createLink = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { tags, destinationUrl, shortUrlKey, workspaceId, comment, expirationTime, password, } = req.body;
    if (!tags || !destinationUrl || !shortUrlKey || !workspaceId) {
        throw new response_1.APIResponseError("All fields are required", 400, false);
    }
    const link = yield linksService_1.default.createLink({
        destinationUrl,
        shortUrlKey,
        tags,
        comment,
        expirationTime,
        password,
        workspaceId,
        creatorId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "", // can't be undefined
    });
    res.status(201).json({
        success: true,
        message: "Link added",
        data: link,
    });
}));
const getLinkByShortUrlKey = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { shortUrlKey } = req.params;
    if (!shortUrlKey) {
        throw new response_1.APIResponseError("Short URL key is required", 400, false);
    }
    const link = yield linksService_1.default.getOneLinkBy({ shortUrlKey, userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "" });
    res.status(200).json({
        success: true,
        message: "",
        data: link,
    });
}));
const getLinksByWorkspaceId = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { workspaceId } = req.params;
    if (!workspaceId) {
        throw new response_1.APIResponseError("Workspace ID is required", 400, false);
    }
    const links = yield linksService_1.default.getLinksByWorkspaceId(workspaceId, ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "");
    res.status(200).json({
        success: true,
        message: "",
        data: links,
    });
}));
const getLinkById = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { linkId } = req.params;
    if (!linkId) {
        throw new response_1.APIResponseError("Link ID is required", 400, false);
    }
    const link = yield linksService_1.default.getOneLinkBy({ linkId, userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "" });
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
        throw new response_1.APIResponseError("Link ID is required", 400, false);
    }
    const link = yield linksService_1.default.updateLink(linkId, req.body, ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "");
    res.status(200).json({
        success: true,
        message: "Link updated successfully",
        data: link,
    });
}));
const deactivateLink = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { linkId } = req.params;
    if (!linkId) {
        throw new response_1.APIResponseError("Link ID is required", 400, false);
    }
    const link = yield linksService_1.default.deactivateLink(linkId, ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "");
    res.status(200).json({
        success: true,
        message: "Link deactivated successfully",
        data: link,
    });
}));
const deleteLink = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { linkId } = req.params;
    if (!linkId) {
        throw new response_1.APIResponseError("Link ID is required", 400, false);
    }
    const link = yield linksService_1.default.deleteLink(linkId, ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) || "");
    res.status(200).json({
        success: true,
        message: "Link deleted successfully",
        data: link,
    });
}));
const linksController = {
    generateShortLinkKey,
    createLink,
    getLinkByShortUrlKey,
    getLinksByWorkspaceId,
    getLinkById,
    updateLink,
    deactivateLink,
    deleteLink,
};
exports.default = linksController;
