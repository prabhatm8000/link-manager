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
const redirectToDestination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortUrlKey } = req.params;
    console.log(shortUrlKey, "shortUrlKey");
    if (!shortUrlKey) {
        res.status(400).json({
            success: false,
            message: "Short URL key is required",
            data: null,
        });
        return;
    }
    const url = yield linksService_1.default.justTheDestinationUrl(shortUrlKey);
    if (!url) {
        res.status(404).json({
            success: false,
            message: "Short URL not found",
            data: null,
        });
        return;
    }
    if (url.password) {
        res.status(401).json({
            success: false,
            message: "Password protected link",
            data: null,
        });
        return;
    }
    res.redirect(url.destinationUrl);
});
const linkRedirectController = {
    redirectToDestination,
};
exports.default = linkRedirectController;
