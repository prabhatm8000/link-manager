import axiosInstance from "@/lib/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiResponseType } from "../reducers/types";

export const getUsage = createAsyncThunk("usage/getUsage", async (wsId: string, { rejectWithValue, fulfillWithValue }) => {
    try {
        const res = await axiosInstance.get(`/usage?wsId=${wsId}`);
        return fulfillWithValue(res.data as ApiResponseType);
    } catch (error: any) {
        return rejectWithValue(error.response.data as ApiResponseType);
    }
});