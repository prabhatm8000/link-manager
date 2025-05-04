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
const express_1 = require("express");
const response_1 = require("../../errors/response");
const asyncWrapper_1 = __importDefault(require("../../lib/asyncWrapper"));
const analyticsRouter_1 = __importDefault(require("./analyticsRouter"));
const eventsRouter_1 = __importDefault(require("./eventsRouter"));
const linksRouter_1 = __importDefault(require("./linksRouter"));
const usersRouter_1 = __importDefault(require("./usersRouter"));
const workspacesRouter_1 = __importDefault(require("./workspacesRouter"));
const apiRouter = (0, express_1.Router)();
// testing route
apiRouter.get("/", (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        message: "Welcome to the API!",
        success: true,
        data: {
            name: "API",
            version: "1.0.0",
            description: "API working fine.",
        },
    });
})));
apiRouter.use("/user", usersRouter_1.default);
apiRouter.use("/workspace", workspacesRouter_1.default);
apiRouter.use("/link", linksRouter_1.default);
apiRouter.use("/event", eventsRouter_1.default);
apiRouter.use("/analytic", analyticsRouter_1.default);
// invalid route
apiRouter.use("/*", (req, res) => {
    throw new response_1.APIResponseError({
        title: "Attempt to access invalid route",
        description: "This route does not exist",
    }, 404, false);
});
// error handler
apiRouter.use(response_1.apiErrorHandler);
exports.default = apiRouter;
