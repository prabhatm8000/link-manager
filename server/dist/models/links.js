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
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const linksSchema = new mongoose_1.default.Schema({
    destinationUrl: {
        type: String,
        required: true,
    },
    shortUrlKey: {
        type: String,
        required: true,
        unique: true,
    },
    metadata: {
        type: {
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            favicon: {
                type: String,
            },
            previewImg: {
                type: String,
            },
        },
    },
    tags: {
        type: [String],
    },
    comment: {
        type: String,
    },
    expirationTime: {
        type: Date,
    },
    password: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "expired"],
        default: "active",
    },
    clickCount: {
        type: Number,
        default: 0,
    },
    workspaceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    creatorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
linksSchema.index({ shortUrlKey: 1 }, { unique: true });
linksSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.password && this.isModified("password")) {
            this.password = yield bcrypt_1.default.hash(this.password, 10);
        }
        next();
    });
});
linksSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const update = this.getUpdate();
        // Check if password is being updated
        if (update && "password" in update && update.password) {
            const hashed = yield bcrypt_1.default.hash(update.password, 10);
            this.setUpdate(Object.assign(Object.assign({}, update), { password: hashed }));
        }
        next();
    });
});
linksSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.password) {
            throw new Error("Password is not set for this link.");
        }
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
linksSchema.set("toJSON", {
    transform: (_, ret) => {
        // delete ret.password;
        ret.hasPassword = !!ret.password;
        return ret;
    },
});
const Links = mongoose_1.default.model("Links", linksSchema);
exports.default = Links;
