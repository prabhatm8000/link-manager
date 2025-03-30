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
const response_1 = require("../errors/response");
const users_1 = __importDefault(require("../models/users"));
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    const user = yield users_1.default.findOne({ email });
    if (!user) {
        throw new response_1.APIResponseError("Invalid email", 401, false);
    }
    if (!(yield user.comparePassword(password))) {
        throw new response_1.APIResponseError("Invalid password", 401, false);
    }
    user.lastLogin = new Date();
    yield user.save();
    return user.toJSON();
});
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, password, profilePicture, }) {
    const user = yield users_1.default.create({
        name,
        email,
        password,
        profilePicture,
    });
    return user.toJSON();
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findById(id);
    return user === null || user === void 0 ? void 0 : user.toJSON();
});
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ email });
    return user === null || user === void 0 ? void 0 : user.toJSON();
});
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findByIdAndUpdate(id, data, { new: true });
    return user === null || user === void 0 ? void 0 : user.toJSON();
});
const deactivateUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findByIdAndUpdate(id, {
        isActive: false,
    }, { new: false });
    return user === null || user === void 0 ? void 0 : user.toJSON();
});
const usersService = {
    login,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deactivateUser,
};
exports.default = usersService;
