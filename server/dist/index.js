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
const PORT = envVars_1.default.PORT;
app.use(configs_1.rateLimiter);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(configs_1.corsConfig);
app.use("/api/v1", router_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
app.get("/*", (req, res) => {
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
