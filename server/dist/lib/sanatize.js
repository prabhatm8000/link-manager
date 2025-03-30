"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanatizeRequestBody = exports.sanatize = void 0;
const sanatize = (input) => {
    return input
        .trim()
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/&/g, "&amp;")
        .replace("$", "&dollar;");
};
exports.sanatize = sanatize;
const sanatizeRequestBody = (req) => {
    if (!req.body)
        return;
    const strBody = JSON.stringify(req.body);
    const sanatizedStrBody = (0, exports.sanatize)(strBody);
    req.body = JSON.parse(sanatizedStrBody);
};
exports.sanatizeRequestBody = sanatizeRequestBody;
