import { createSlice } from "@reduxjs/toolkit";
import { getUsage } from "../thunks/usageThunks";
import type { ApiResponseType, IUsageState } from "./types";

const initialState: IUsageState = {
    usage: {
        subscriptionTier: "",
        quota: {
            workspaces: {
                label: "Workspaces",
                used: 0,
                total: 0,
                per: "",
            },
            links: {
                label: "Links",
                used: 0,
                total: 0,
                per: "",
            },
            events: {
                label: "Events",
                used: 0,
                total: 0,
                per: "",
            },
        }
    },
    loading: false,
    error: null,
    message: null,
};

const usageSlice = createSlice({
    name: "usage",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsage.fulfilled, (state, action) => {
            state.usage = action.payload.data;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getUsage.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUsage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });
    },
});

export default usageSlice.reducer;