import type { DaterangeType } from "@/components/DaterangeDropdown";
import axiosInstance from "@/lib/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiResponseType } from "../reducers/types";

export const getEvents = createAsyncThunk(
    "events/getEvents",
    async (
        d: {
            workspaceId: string;
            linkId?: string;
            skip?: number;
            limit?: number;
            daterange?: DaterangeType;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/event/${d.workspaceId}?skip=${d.skip || 0}&limit=${
                    d.limit || 10
                }&linkId=${d.linkId || ""}&fetchRange=${d.daterange || "24h"}`
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);
