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
            email?: string;
            password?: string;
            credential?: string;
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

export const sendPasswordReset = createAsyncThunk(
    "user/sendPasswordReset",
    async (
        data: {
            email: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                "/user/sendPasswordReset",
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async (
        data: {
            uid: string;
            vt: string;
            pw: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                "/user/resetPassword",
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/registerUser",
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
                "/user/register",
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const resendVerification = createAsyncThunk(
    "user/resendVerification",
    async (
        data: {
            email: string;
            password: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/user/resendVerification", data);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const verifyUserEmail = createAsyncThunk(
    "user/verifyUserEmail",
    async (
        data: {
            uid: string;
            vt: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                "/user/verifyUserEmail",
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const cancelVerification = createAsyncThunk(
    "user/cancelVerification",
    async (
        data: {
            uid: string;
            vt: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                "/user/cancelVerification",
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const updateUser = createAsyncThunk(
    "user/update",
    async (
        data: {
            name: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.patch("/user/update", data);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const deleteUser = createAsyncThunk(
    "user/delete",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.delete("/user/delete");
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);