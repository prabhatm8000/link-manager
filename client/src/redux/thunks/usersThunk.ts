import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";
import type { ApiResponseType } from "../reducers/types";

export const verifyUser = createAsyncThunk(
    "user/verify",
    async (): Promise<ApiResponseType> => {
        const res = await axiosInstance.get("/user/verify");
        return res.data as ApiResponseType;
    }
);

export const login = createAsyncThunk(
    "user/login",
    async (data: {
        email: string;
        password: string;
    }): Promise<ApiResponseType> => {
        const res = await axiosInstance.post("/user/login", data);
        return res.data as ApiResponseType;
    }
);

export const registerAndSendOtp = createAsyncThunk(
    "user/register-send-otp",
    async (data: {
        email: string;
        name: string;
        password: string;
    }): Promise<ApiResponseType> => {
        const res = await axiosInstance.post("/user/register-send-otp", data);
        return res.data as ApiResponseType;
    }
);

export const registerAndVerifyOtp = createAsyncThunk(
    "user/register-verify-otp",
    async (data: { email: string; otp: string }): Promise<ApiResponseType> => {
        const res = await axiosInstance.post(
            "/user/register-verify-otp",
            data
        );
        return res.data as ApiResponseType;
    }
);
