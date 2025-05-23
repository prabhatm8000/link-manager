import { createSlice } from "@reduxjs/toolkit";
import { getAnalytics } from "../thunks/analyticsThunks";
import type { ApiResponseType, IAnalyticsState } from "./types";

const initialState: IAnalyticsState = {
    analytics: {
        browser: [],
        device: [],
        os: [],
        country: [],
        region: [],
        city: [],
        metrix: {
            totalClicks: 0,
            maxClicks: { date: "", count: 0 },
            minClicks: { date: "", count: 0 },
            dateWiseClickCount: []
        }
    },
    loading: false,
    error: null,
    message: null,
};

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {
        clearState: (state) => {
            state.analytics = {
                browser: [],
                device: [],
                os: [],
                country: [],
                region: [],
                city: [],
                metrix: {
                    totalClicks: 0,
                    maxClicks: { date: "", count: 0 },
                    minClicks: { date: "", count: 0 },
                    dateWiseClickCount: []
                }
            }
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAnalytics.fulfilled, (state, action) => {
            state.analytics = action.payload.data;
            state.loading = false;
            state.error = null;
            state.message = null;
        })
        builder.addCase(getAnalytics.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        builder.addCase(getAnalytics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        })
    },
});

export const { clearState } = analyticsSlice.actions;
export default analyticsSlice.reducer;