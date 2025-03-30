"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = exports.disconnectFromDB = exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const envVars_1 = __importDefault(require("../constants/envVars"));
const response_1 = require("../errors/response");
const connectToDB = () => {
    const mongo = mongoose_1.default.connect(envVars_1.default.MONGODB_URI);
    // mongo
    //     .then((o) =>
    //         o.connection.db?.collection("users")?.dropIndex("name_1")
    //     )
    //     .then((_) => console.log("done"));
    return mongo;
};
exports.connectToDB = connectToDB;
const disconnectFromDB = () => mongoose_1.default.disconnect();
exports.disconnectFromDB = disconnectFromDB;
/**
 *
 * @param id
 * @returns true or throws APIResponseError
 */
const validateObjectId = (...ids) => {
    if (!ids.length)
        throw new Error("At least one id is required");
    for (const id of ids) {
        const isValid = mongoose_1.default.Types.ObjectId.isValid(id);
        if (!isValid)
            throw new response_1.APIResponseError("Something went wrong", 400, false);
    }
    return true;
};
exports.validateObjectId = validateObjectId;
