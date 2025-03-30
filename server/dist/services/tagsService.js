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
const mongoose_1 = __importDefault(require("mongoose"));
const tags_1 = __importDefault(require("../models/tags"));
const MAX_TAG_LENGTH = 20;
const addTags = (workspaceId, tags) => __awaiter(void 0, void 0, void 0, function* () {
    const setValues = new Set(tags.map((tag) => {
        if (tag.length > MAX_TAG_LENGTH)
            tag = tag.slice(0, MAX_TAG_LENGTH);
        return tag.trim().toLowerCase();
    })).values();
    const filteredTags = Array.from(setValues);
    const newTags = yield tags_1.default.findOneAndUpdate({ workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId) }, { $addToSet: { tags: { $each: filteredTags } } }, // Prevents duplicates
    { upsert: true, new: true } // Creates new document if it doesn't exist
    );
    return newTags;
});
const deleteTags = (workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    return tags_1.default.findOneAndDelete({
        workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId),
    });
});
const getTags = (workspaceId) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield tags_1.default.findOne({
        workspaceId: new mongoose_1.default.Types.ObjectId(workspaceId),
    });
    return tags;
});
const tagsService = { addTags, getTags, deleteTags };
exports.default = tagsService;
