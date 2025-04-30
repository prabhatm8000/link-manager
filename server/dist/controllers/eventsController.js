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
const messages_1 = __importDefault(require("../constants/messages"));
const response_1 = require("../errors/response");
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const mongodb_1 = require("../lib/mongodb");
const eventsService_1 = __importDefault(require("../services/eventsService"));
const statusMessgaes = new messages_1.default("events");
const getEvents = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { linkId, type, limit = 10, skip = 0 } = req.query;
    (0, mongodb_1.validateObjectId)(linkId);
    const events = yield eventsService_1.default.getEventsByLinkId({
        linkId: linkId,
        type: type,
        limit: Number(limit),
        skip: Number(skip),
    });
    res.status(200).json({
        success: true,
        message: "",
        data: events,
    });
}));
const getEventById = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    (0, mongodb_1.validateObjectId)(eventId);
    const event = yield eventsService_1.default.getEventById(eventId);
    if (!event) {
        throw new response_1.APIResponseError(statusMessgaes.getMessage("Event not found", "error", "other"), 404, false);
    }
    res.status(200).json({
        success: true,
        message: "",
        data: event,
    });
}));
const eventsController = { getEvents, getEventById };
exports.default = eventsController;
