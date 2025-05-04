"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventsController_1 = __importDefault(require("../../controllers/eventsController"));
const eventsRouter = (0, express_1.Router)();
eventsRouter.get("/:workspaceId", eventsController_1.default.getEvents);
eventsRouter.get("/event/:eventId", eventsController_1.default.getEventById);
exports.default = eventsRouter;
