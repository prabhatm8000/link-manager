import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";
import type { ApiResponseType } from "../reducers/types";

export const verifyUser = createAsyncThunk(
    "users/verify",
    async (): Promise<ApiResponseType> => {
        const res = await axiosInstance.get("/users/verify");
        return res.data as ApiResponseType;
    }
);

export const login = createAsyncThunk(
    "users/login",
    async (data: {
        email: string;
        password: string;
    }): Promise<ApiResponseType> => {
        const res = await axiosInstance.post("/users/login", data);
        return res.data as ApiResponseType;
    }
);

export const registerAndSendOtp = createAsyncThunk(
    "users/register-send-otp",
    async (data: {
        email: string;
        name: string;
        password: string;
    }): Promise<ApiResponseType> => {
        const res = await axiosInstance.post("/users/register-send-otp", data);
        return res.data as ApiResponseType;
    }
);

export const registerAndVerifyOtp = createAsyncThunk(
    "users/register-verify-otp",
    async (data: { email: string; otp: string }): Promise<ApiResponseType> => {
        const res = await axiosInstance.post("/users/register-verify-otp", data);
        return res.data as ApiResponseType;
    }
);
