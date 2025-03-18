import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiResponseType } from "../reducers/types";
import axiosInstance from "../../lib/axiosInstance";

export const generateShortLinkKey = createAsyncThunk(
    "links/generate-short-link-key",
    async (data: { size?: number }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.post(
                "/link/generate-short-link-key",
                data
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const createLink = createAsyncThunk(
    "links/create",
    async (
        data: {
            name: string;
            tags: string[];
            destinationUrl: string;
            shortUrlKey: string;
            creatorId: string;
            workspaceId: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/link", data);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const getLinksByWorkspaceId = createAsyncThunk(
    "links/get-by-workspace-id",
    async (workspaceId: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `/link/workspace/${workspaceId}`
            );
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const updateLink = createAsyncThunk(
    "links/update",
    async (
        data: {
            linkId: string;
            name: string;
            tags: string[];
            destinationUrl: string;
        },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.patch(`/link/${data.linkId}`, data);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const deleteLink = createAsyncThunk(
    "links/delete",
    async (linkId: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.delete(`/link/${linkId}`);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const deactivateLink = createAsyncThunk(
    "links/deactivate",
    async (linkId: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/link/${linkId}/deactivate`);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const getLinkByShortUrlKey = createAsyncThunk(
    "links/get-by-short-url-key",
    async (shortUrlKey: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get(`/link/${shortUrlKey}`);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const getLinkById = createAsyncThunk(
    "links/get-by-id",
    async (linkId: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get(`/link/${linkId}`);
            return fulfillWithValue(res.data as ApiResponseType);
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);
