import { createSlice } from "@reduxjs/toolkit";
import type { ApiResponseType, ILinkState } from "./types";
import {
    createLink,
    deactivateLink,
    deleteLink,
    getLinkById,
    getLinkByShortUrlKey,
    getLinksByWorkspaceId,
    updateLink,
} from "../thunks/linksThunks";

const initialState: ILinkState = {
    links: [],
    loading: false,
    error: null,
    message: null,
    deleteLoading: false,
    updateLoading: false,
};

const linksSlice = createSlice({
    name: "links",
    initialState,
    reducers: {
        clearState: (state) => {
            state.links = [];
            state.loading = false;
            state.error = null;
            state.message = null;
            state.deleteLoading = false;
            state.updateLoading = false;
        },
    },
    extraReducers: (builder) => {
        // createLink
        // builder.addCase(createLink.pending, (state) => {});
        builder.addCase(createLink.fulfilled, (state, action) => {
            state.links.push(action.payload.data);
        });
        builder.addCase(createLink.rejected, (state, action) => {
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // getLinksByWorkspaceId
        builder.addCase(getLinksByWorkspaceId.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLinksByWorkspaceId.fulfilled, (state, action) => {
            state.loading = false;
            state.links = action.payload.data;
        });
        builder.addCase(getLinksByWorkspaceId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // getLinkById
        builder.addCase(getLinkById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLinkById.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(getLinkById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // updateLink
        builder.addCase(updateLink.pending, (state) => {
            state.updateLoading = true;
        });
        builder.addCase(updateLink.fulfilled, (state, action) => {
            state.updateLoading = false;
            state.links = state.links.map((link) =>
                link._id === action.payload.data._id
                    ? action.payload.data
                    : link
            );
        });
        builder.addCase(updateLink.rejected, (state, action) => {
            state.updateLoading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // deactivateLink
        builder.addCase(deactivateLink.pending, (state) => {
            state.updateLoading = true;
        });
        builder.addCase(deactivateLink.fulfilled, (state, action) => {
            state.updateLoading = false;
            state.links = state.links.map((link) =>
                link._id === action.payload.data._id
                    ? action.payload.data
                    : link
            );
        });
        builder.addCase(deactivateLink.rejected, (state, action) => {
            state.updateLoading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // deleteLink
        builder.addCase(deleteLink.pending, (state) => {
            state.deleteLoading = true;
        });
        builder.addCase(deleteLink.fulfilled, (state, action) => {
            state.deleteLoading = false;
            state.links = state.links.filter(
                (link) => link._id !== action.payload.data._id
            );
        });
        builder.addCase(deleteLink.rejected, (state, action) => {
            state.deleteLoading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // getLinkByShortUrlKey
        builder.addCase(getLinkByShortUrlKey.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLinkByShortUrlKey.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(getLinkByShortUrlKey.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });
    },
});

export const linksActions = linksSlice.actions;
export default linksSlice.reducer;
