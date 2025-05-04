"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchObjectId = exports.validateObjectId = exports.disconnectFromDB = exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const envVars_1 = __importDefault(require("../constants/envVars"));
const connectToDB = () => {
    try {
        const mongo = mongoose_1.default.connect(envVars_1.default.MONGODB_URI, {
            dbName: "link-manager",
        });
        return mongo;
    }
    catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
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
            throw new Error("Invalid ObjectId");
    }
    return true;
};
exports.validateObjectId = validateObjectId;
const matchObjectId = (id1, id2) => {
    (0, exports.validateObjectId)(id1, id2);
    if (id1.toString() !== id2.toString()) {
        return false;
    }
    return true;
};
exports.matchObjectId = matchObjectId;
