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
const asyncWrapper_1 = __importDefault(require("../lib/asyncWrapper"));
const mongodb_1 = require("../lib/mongodb");
const analyticsService_1 = __importDefault(require("../services/analyticsService"));
const getAnalytics = (0, asyncWrapper_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { linkId, workspaceId } = req.params;
    const { startDate, endDate, grouping } = req.query;
    (0, mongodb_1.validateObjectId)(linkId);
    (0, mongodb_1.validateObjectId)(workspaceId);
    const analytics = yield analyticsService_1.default.getAnalyticsByDateRange({
        linkId: linkId,
        workspaceId: workspaceId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        grouping: grouping
            ? grouping
            : undefined,
    });
    res.status(200).json({
        success: true,
        message: "",
        data: analytics,
    });
}));
const analyticsController = { getAnalytics };
exports.default = analyticsController;
