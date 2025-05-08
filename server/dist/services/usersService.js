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
const envVars_1 = __importDefault(require("../constants/envVars"));
const response_1 = require("../errors/response");
const oAuthClient_1 = __importDefault(require("../lib/oAuthClient"));
const usage_1 = __importDefault(require("../models/usage"));
const users_1 = __importDefault(require("../models/users"));
const workspaces_1 = __importDefault(require("../models/workspaces"));
/**
 * --- local login ---
 * with email and password
 * returns the user, if exists else throws error
 *
 * --- google login ---
 * with credentialFromGoogleAuth
 * returns the user, if exists else creates a new user
 * @param param: {email: string, password: string, credentialFromGoogleAuth: any}
 * @returns
 */
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, credentialFromGoogleAuth, }) {
    let user = null;
    if (credentialFromGoogleAuth) {
        // perform google auth
        const ticket = yield oAuthClient_1.default.verifyIdToken({
            idToken: credentialFromGoogleAuth,
            audience: envVars_1.default.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new response_1.APIResponseError("Invalid token", 401, false);
        }
        const findingUser = yield users_1.default.findOne({ email: payload.email });
        if (!findingUser && payload.email) {
            user = yield createUser({
                name: payload.name || "",
                email: payload.email,
                profilePicture: payload.picture,
                authType: "google",
            }, {
                creatingWhileLogin: true,
            });
        }
        else {
            if ((findingUser === null || findingUser === void 0 ? void 0 : findingUser.authType) !== "google") {
                throw new response_1.APIResponseError("Please use email and password to login", 400, false);
            }
            user = findingUser;
        }
    }
    else {
        // perform normal login
        if (!email || !password) {
            throw new response_1.APIResponseError("Email and password are required", 400, false);
        }
        const findingUser = yield users_1.default.findOne({ email });
        if (!findingUser) {
            throw new response_1.APIResponseError("Invalid email", 401, false);
        }
        if (findingUser.authType && findingUser.authType !== "local") {
            throw new response_1.APIResponseError("Bad authentication type", 400, false);
        }
        if (!(yield findingUser.comparePassword(password))) {
            throw new response_1.APIResponseError("Invalid password", 401, false);
        }
        user = findingUser;
        user.lastLogin = new Date();
        yield user.save();
    }
    if (!user) {
        throw new response_1.APIResponseError("User not found", 404, false);
    }
    return user;
});
/**
 *
 * @param: {name: string, email: string, password: string, profilePicture: string}
 * @returns
 */
const createUser = (_a, options_1) => __awaiter(void 0, [_a, options_1], void 0, function* ({ name, email, password, profilePicture, authType, }, options) {
    const session = (options === null || options === void 0 ? void 0 : options.session)
        ? options === null || options === void 0 ? void 0 : options.session
        : yield mongoose_1.default.startSession();
    if (!(options === null || options === void 0 ? void 0 : options.session)) {
        // session from outside will be handled from there only, don't care!
        session.startTransaction();
    }
    const userId = new mongoose_1.default.Types.ObjectId();
    const usageId = new mongoose_1.default.Types.ObjectId();
    const user = new users_1.default({
        _id: userId,
        name,
        email,
        password,
        profilePicture,
        isVerified: authType === "google", // in the case of google auth, the user is automatically verified
        authType,
        usageId,
        lastLogin: (options === null || options === void 0 ? void 0 : options.creatingWhileLogin) ? new Date() : undefined,
    });
    const usage = new usage_1.default({
        _id: usageId,
        userId: user._id,
        workspaceCount: 1, // cause we are creating a dummy workspace
        linkCount: [],
    });
    const ws = new workspaces_1.default({
        name: "Dummy workspace",
        description: "This is a dummy workspace, you can delete it or rename it or create a new one, according to your needs.",
        createdBy: user._id,
        people: [user._id],
    });
    yield user.save({ session });
    yield usage.save({ session });
    yield ws.save({ session });
    if (!(options === null || options === void 0 ? void 0 : options.session)) {
        // session from outside will be handled from there only, don't care!
        yield session.commitTransaction();
    }
    return user.toJSON();
});
/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @returns
 */
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findById(id);
    return user === null || user === void 0 ? void 0 : user.toJSON();
});
/**
 *
 * @param email
 * @returns
 */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ email });
    return user === null || user === void 0 ? void 0 : user.toJSON();
});
/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @param data
 * @returns
 */
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findByIdAndUpdate(id, data, { new: true });
    return user === null || user === void 0 ? void 0 : user.toJSON();
});
/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @returns
 */
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
