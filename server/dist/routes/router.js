"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersRouter_1 = __importDefault(require("./usersRouter"));
const workspacesRouter_1 = __importDefault(require("./workspacesRouter"));
const linksRouter_1 = __importDefault(require("./linksRouter"));
const router = (0, express_1.Router)();
router.use("/user", usersRouter_1.default);
router.use("/workspace", workspacesRouter_1.default);
router.use("/link", linksRouter_1.default);
exports.default = router;
