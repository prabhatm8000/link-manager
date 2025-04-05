"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const configs_1 = require("./constants/configs");
const envVars_1 = __importDefault(require("./constants/envVars"));
const consoleColor_1 = __importDefault(require("./lib/consoleColor"));
const mongodb_1 = require("./lib/mongodb");
const router_1 = __importDefault(require("./routes/router"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = parseInt(envVars_1.default.PORT);
// for prod, ui files will be served by express, so it'll be [same-site]
if (envVars_1.default.NODE_ENV === "dev") {
    app.use(configs_1.corsConfig);
    // log requests
    app.use(function (req, res, next) {
        console.log((0, consoleColor_1.default)(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`, "FgCyan"));
        next();
    });
}
app.use(configs_1.rateLimiter);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", router_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist"), {
    maxAge: "1y", // browser cache ui files
    etag: true // force cache use
}));
// for prod, serving ui files
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../client/dist", "index.html"));
});
app.listen(PORT, "0.0.0.0", () => {
    (0, mongodb_1.connectToDB)()
        .catch((err) => {
        console.log(err);
        process.exit(1);
    })
        .finally(() => {
        console.log((0, consoleColor_1.default)("Connected to database", "BgYellow"));
        console.log((0, consoleColor_1.default)(`Server running on port ${PORT}`, "BgBlue"));
    });
});
