import axiosInstance from "@/lib/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiResponseType } from "../reducers/types";

export const getAnalytics = createAsyncThunk(
    "events/getAnalytics",
    async (
        d: {
            workspaceId: string;
            linkId: string;
            startDate?: string;
            endDate?: string;
            grouping?: "daily" | "weekly" | "monthly";
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/analytic/${d.workspaceId}/${d.linkId}?startDate=${
                    d.startDate || ""
                }&endDate=${d.endDate || ""}&grouping=${d.grouping || "daily"}`
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);
