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
const envVars_1 = __importDefault(require("../constants/envVars"));
const response_1 = require("../errors/response");
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const renderRedirectHtml_1 = __importDefault(require("../lib/renderRedirectHtml"));
const analyticsService_1 = __importDefault(require("../services/analyticsService"));
const eventsService_1 = __importDefault(require("../services/eventsService"));
const linksService_1 = __importDefault(require("../services/linksService"));
const redirectToDestination = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { shortUrlKey } = req.params;
    const password = (_a = req.query) === null || _a === void 0 ? void 0 : _a.p;
    if (!shortUrlKey) {
        res.status(400).json({
            success: false,
            message: "Short URL key is required",
            data: null,
        });
        return;
    }
    let destinationUrl;
    let status;
    let messedUpFlag = false;
    const url = yield linksService_1.default.justTheLink(shortUrlKey);
    if (!url || !url.shortUrl) {
        throw new response_1.APIResponseError("Short URL not found", 404, false);
    }
    destinationUrl = url.destinationUrl;
    status = url.status;
    if (url.expirationTime && url.expirationTime < new Date()) {
        destinationUrl =
            "/error-page?code=410&title=Link%20Expired&description=The%20link%20has%20expired.";
        messedUpFlag = true;
    }
    // password protected
    if (url.password) {
        if (!password || typeof password !== "string") {
            // not password, ask for password
            destinationUrl = "/link-password?surl=" + url.shortUrl;
            messedUpFlag = true;
        }
        else if (!(yield url.comparePassword(password))) {
            // wrong password
            destinationUrl =
                "/link-password?error=true&surl=" + url.shortUrl;
            messedUpFlag = true;
        }
    }
    // if we messed up, we are redirecting our self,
    // and if we are in dev mode, we need to add the client url
    if (messedUpFlag && envVars_1.default.NODE_ENV === "dev") {
        destinationUrl = envVars_1.default.CLIENT_URL + destinationUrl;
    }
    if (!messedUpFlag) {
        // capturing the event on no messedUpFlag
        // void, i know but we don't care about the result
        // and intentionally not using await
        void eventsService_1.default
            .captureEvent(url._id, url.workspaceId, "CLICK", req.metadata)
            .catch((err) => console.error("Event capture failed:", err));
        // capturing the analytics data (date wise)
        void analyticsService_1.default
            .captureData({
            workspaceId: url.workspaceId,
            linkId: url._id,
            date: new Date(),
            metadata: req.metadata,
        })
            .catch((err) => console.error("Analytics capture failed:", err));
    }
    res.send((0, renderRedirectHtml_1.default)({
        shortUrl: url.shortUrl,
        destinationUrl,
        metadata: url.metadata,
        status,
    }));
}));
const linkRedirectController = {
    redirectToDestination,
};
exports.default = linkRedirectController;
