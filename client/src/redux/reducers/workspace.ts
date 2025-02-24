import { createSlice } from "@reduxjs/toolkit";
import {
    createWorkspace,
    deactivateWorkspace,
    getAllWorkspaces,
    getWorkspaceById,
    updateWorkspace,
} from "../thunks/workspaceThunks";
import type { ApiResponseType, IWorkspace, IWorkspaceState } from "./types";

const initialState: IWorkspaceState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
    message: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action) => {
            state.currentWorkspace = action.payload;
        },
    },
    extraReducers: (builder) => {
        // createWorkspace
        builder.addCase(createWorkspace.fulfilled, (state, action) => {
            state.workspaces.push(action.payload.data as IWorkspace);
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(createWorkspace.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(createWorkspace.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // getAllWorkspaces
        builder.addCase(getAllWorkspaces.fulfilled, (state, action) => {
            state.workspaces = action.payload.data as IWorkspace[];
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getAllWorkspaces.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getAllWorkspaces.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // getWorkspaceById
        builder.addCase(getWorkspaceById.fulfilled, (state, action) => {
            state.currentWorkspace = action.payload.data as IWorkspace;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getWorkspaceById.pending, (state) => {
            state.currentWorkspace = null;
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getWorkspaceById.rejected, (state, action) => {
            state.currentWorkspace = null;
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // updateWorkspace
        builder.addCase(updateWorkspace.fulfilled, (state, action) => {
            state.workspaces = state.workspaces.map((workspace) =>
                workspace._id === action.payload.data._id
                    ? action.payload.data
                    : workspace
            );
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(updateWorkspace.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(updateWorkspace.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // deactivateWorkspace
        builder.addCase(deactivateWorkspace.fulfilled, (state, action) => {
            state.workspaces = state.workspaces.filter(
                (workspace) => workspace._id !== action.payload.data._id
            );
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(deactivateWorkspace.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(deactivateWorkspace.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });
    },
});

export default workspaceSlice.reducer;
