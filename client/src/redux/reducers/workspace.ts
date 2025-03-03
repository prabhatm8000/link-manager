import { createSlice } from "@reduxjs/toolkit";
import {
    createWorkspace,
    deleteWorkspace,
    getAllWorkspaces,
    getMyWorkspaces,
    getWorkspaceById,
    postAcceptInvite,
    removeTeamMember,
    sendInvite,
    updateWorkspace,
} from "../thunks/workspaceThunks";
import type {
    ApiResponseType,
    IUser,
    IWorkspace,
    IWorkspaceState,
} from "./types";

const initialState: IWorkspaceState = {
    workspaces: [],
    currentWorkspace: null,
    currentWorkspaceTeam: [],
    myWorkspaces: [],
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
            state.myWorkspaces.push(action.payload.data as IWorkspace); // why pushing on both? think you'll know.
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

        // getMyWorkspaces
        builder.addCase(getMyWorkspaces.fulfilled, (state, action) => {
            state.myWorkspaces = action.payload.data as IWorkspace[];
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getMyWorkspaces.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getMyWorkspaces.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // getWorkspaceById
        builder.addCase(getWorkspaceById.fulfilled, (state, action) => {
            state.currentWorkspace = action.payload.data as IWorkspace;
            state.currentWorkspaceTeam = [] as IUser[];
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getWorkspaceById.pending, (state) => {
            state.currentWorkspace = null;
            state.currentWorkspaceTeam = [] as IUser[];
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(getWorkspaceById.rejected, (state, action) => {
            state.currentWorkspace = null;
            state.currentWorkspaceTeam = [] as IUser[];
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
            state.myWorkspaces = state.myWorkspaces.map((workspace) =>
                workspace._id === action.payload.data._id
                    ? action.payload.data
                    : workspace
            );
            state.currentWorkspace =
                action.payload.data._id === state.currentWorkspace?._id
                    ? action.payload.data
                    : state.currentWorkspace;
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

        // deleteWorkspace
        builder.addCase(deleteWorkspace.fulfilled, (state, action) => {
            state.workspaces = state.workspaces.filter(
                (workspace) => workspace._id !== action.payload.data._id
            );
            state.myWorkspaces = state.myWorkspaces.filter(
                (workspace) => workspace._id !== action.payload.data._id
            );
            state.currentWorkspace =
                state.currentWorkspace?._id === action.payload.data._id
                    ? state.workspaces[0]
                    : state.currentWorkspace;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(deleteWorkspace.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(deleteWorkspace.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // inviteUserToWorkspace
        builder.addCase(sendInvite.fulfilled, (state, _) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(sendInvite.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(sendInvite.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // postAcceptInvite
        builder.addCase(postAcceptInvite.fulfilled, (state, _) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(postAcceptInvite.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(postAcceptInvite.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });

        // removeTeamMember
        builder.addCase(removeTeamMember.fulfilled, (state, action) => {
            state.currentWorkspaceTeam = state.currentWorkspaceTeam.filter(
                (member) => member._id !== action.payload.data.memberId
            );
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(removeTeamMember.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(removeTeamMember.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType)?.message;
        });
    },
});

export default workspaceSlice.reducer;
