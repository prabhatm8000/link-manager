import type { Request } from "express";

export const sanatize = (input: string) => {
    return input
        .trim()
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/&/g, "&amp;")
        .replace("$", "&dollar;");
};

export const sanatizeRequestBody = (req: Request) => {
    if (!req.body) return;
    const strBody = JSON.stringify(req.body);
    const sanatizedStrBody = sanatize(strBody);
    req.body = JSON.parse(sanatizedStrBody);
};
