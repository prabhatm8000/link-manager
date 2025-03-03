import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";
import type { ApiResponseType } from "../reducers/types";

export const verifyUser = createAsyncThunk(
    "user/verify",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get("/user/verify");
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const login = createAsyncThunk(
    "user/login",
    async (
        data: {
            email: string;
            password: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/user/login", data);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/logout");
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const registerAndSendOtp = createAsyncThunk(
    "user/register-send-otp",
    async (
        data: {
            email: string;
            name: string;
            password: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                "/user/register-send-otp",
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const resendOtp = createAsyncThunk(
    "user/resend-otp",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.post("/user/resend-otp", {
                resend: true,
            });
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const registerAndVerifyOtp = createAsyncThunk(
    "user/register-verify-otp",
    async (
        data: {
            email: string;
            otp: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                "/user/register-verify-otp",
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);
