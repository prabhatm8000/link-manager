import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";
import type { ApiResponseType } from "../reducers/types";

export const createWorkspace = createAsyncThunk(
    "workspace/create",
    async (
        data: {
            name: string;
            description: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/workspace", data);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const getAllWorkspaces = createAsyncThunk(
    "workspace/get-all",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get("/workspace");
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const getMyWorkspaces = createAsyncThunk(
    "workspace/get-my",
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get("/workspace/my");
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const getWorkspaceById = createAsyncThunk(
    "workspace/get-by-id",
    async (id: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get(`/workspace/id/${id}`);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const updateWorkspace = createAsyncThunk(
    "workspace/update",
    async (
        data: {
            id: string;
            name: string;
            description: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.patch(
                `/workspace/id/${data.id}`,
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const deleteWorkspace = createAsyncThunk(
    "workspace/delete",
    async (id: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/workspace/id/${id}`);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const sendInvite = createAsyncThunk(
    "workspace/send-invite",
    async (
        data: { email: string; workspaceId: string },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                `/workspace/invite/${data.workspaceId}`,
                {
                    email: data.email,
                }
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

/**
 * No reducer
 * State Management not needed! (as of now)
 */
export const getAcceptInvite = createAsyncThunk(
    "workspace/accept-invite",
    async (
        data: {
            workspaceId: string;
            senderId: string;
            token: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.get(
                `/workspace/invite/${data.workspaceId}/${data.senderId}/${data.token}`
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const postAcceptInvite = createAsyncThunk(
    "workspace/post-accept-invite",
    async (
        data: {
            workspaceId: string;
            senderId: string;
            token: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                `/workspace/invite/${data.workspaceId}/${data.senderId}/${data.token}`
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const removeTeamMember = createAsyncThunk(
    "workspace/remove-team-member",
    async (
        data: {
            workspaceId: string;
            memberId: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post(
                `/workspace/team-members/${data.workspaceId}`,
                {
                    memberId: data.memberId,
                }
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);
