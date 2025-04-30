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
const request_ip_1 = __importDefault(require("request-ip"));
const ua_parser_js_1 = require("ua-parser-js");
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const uaMiddleware = (0, asyncWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parser = new ua_parser_js_1.UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();
    const ip = request_ip_1.default.getClientIp(req);
    const regionData = req.headers["x-vercel-ip-country"];
    let region = "";
    if (Array.isArray(regionData)) {
        region = regionData.join(",");
    }
    else {
        region = regionData || "unknown";
    }
    req.metadata = {
        userAgent: req.headers["user-agent"] || "",
        ip: ip || "unknown",
        browser: ua.browser.name || "unknown",
        os: ua.os.name || "unknown",
        device: ua.device.type || "desktop",
        region,
        referer: req.headers.referer || "unknown",
    };
    next();
}));
exports.default = uaMiddleware;
