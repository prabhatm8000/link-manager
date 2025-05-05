"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const envVars_1 = __importDefault(require("../constants/envVars"));
const router_1 = __importDefault(require("./api/router"));
const router_2 = __importDefault(require("./redirect/router"));
const router = (0, express_1.Router)();
router.use("/api/v1", router_1.default);
// has this regex logic in the route to avoid conflicts with SPA(single page app) ([a-zA-Z0-9]{10})
router.use("/", router_2.default);
// #region Static Files
if (envVars_1.default.NODE_ENV !== "dev") {
    router.use(express_1.default.static(path_1.default.join(__dirname, "../../clientBuild"), {
        maxAge: "1y", // browser cache ui files
        etag: true, // force cache use
    }));
    // for prod, serving ui files
    router.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../../clientBuild", "index.html"));
    });
}
// #endregion
exports.default = router;
