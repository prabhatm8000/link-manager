import { createSlice } from "@reduxjs/toolkit";
import { getEvents } from "../thunks/eventsThunks";
import type { ApiResponseType, IEventState } from "./types";

const initialState: IEventState = {
    events: [],
    loading: false,
    hasMore: true,
    error: null,
    message: null,
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        clearState: (state) => {
            state.events = [];
            state.hasMore = true;
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getEvents.fulfilled, (state, action) => {
            const dataArray = action.payload.data
            state.loading = false;
            state.events.push(...dataArray);
            state.hasMore = dataArray.length > 0;
        });
        builder.addCase(getEvents.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });
    },
});

export const { clearState } = eventsSlice.actions;
export default eventsSlice.reducer;
