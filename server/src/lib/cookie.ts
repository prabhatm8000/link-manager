import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import {
    authCookieConfig,
    jwtConfig,
    otpConfig,
    otpCookieConfig,
} from "../constants/configs";
import envVars from "../constants/envVars";
import { APIResponseError } from "../errors/response";

const JWT_SECRET = envVars.JWT_SECRET as string;

// #region auth
export const setAuthCookie = (res: Response, payload: any) => {
    const token = jwt.sign({ payload }, JWT_SECRET, {
        expiresIn: jwtConfig.jwtTokenExpires,
    });
    res.cookie(authCookieConfig.authCookieName, token, {
        ...authCookieConfig, // httpOnly secure sameSite maxAge
    });
};

export const getAuthCookie = async (req: any): Promise<any> => {
    const token = req?.cookies?.[authCookieConfig.authCookieName];

    if (!token) {
        throw new APIResponseError("", 401, false);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded.payload) {
        throw new APIResponseError("", 401, false);
    }

    return (decoded as JwtPayload).payload;
};

export const removeAuthCookie = (res: Response) => {
    res.clearCookie(authCookieConfig.authCookieName);
};

// #endregion auth

// #region otp
type OtpPayload = {
    email: string;
    name: string;
    password: string;
};

export const setOtpCookie = (res: Response, payload: OtpPayload) => {
    const token = jwt.sign({ payload }, JWT_SECRET, {
        expiresIn: otpConfig.expiresAt,
    });

    res.cookie(otpCookieConfig.otpCookieName, token, {
        ...otpCookieConfig, // httpOnly secure sameSite maxAge
    });
};

export const getOtpCookie = async (req: Request): Promise<OtpPayload> => {
    const token = req?.cookies?.[otpCookieConfig.otpCookieName];

    if (!token) {
        throw new APIResponseError("Unauthorized", 401, false);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string" || !decoded.payload) {
        throw new APIResponseError("Unauthorized", 401, false);
    }

    return (decoded as JwtPayload).payload as OtpPayload;
};

export const removeOtpCookie = (res: Response) => {
    res.clearCookie(otpCookieConfig.otpCookieName);
};

// #endregion otp
