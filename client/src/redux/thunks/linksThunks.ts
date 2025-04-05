import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiResponseType } from "../reducers/types";
import axiosInstance from "../../lib/axiosInstance";

export const generateShortUrlKey = createAsyncThunk(
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
            destinationUrl: string;
            shortUrlKey: string;
            workspaceId: string;

            tags?: string[];
            comment?: string;
            expirationTime?: string[];
            password?: string;
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
    async (data: {workspaceId: string, q?: string}, { rejectWithValue, fulfillWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `/link/workspace/${data.workspaceId}?q=${data.q}`
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
            workspaceId: string;
            shortUrlKey: string;

            tags?: string[];
            comment?: string;
            expirationTime?: string[];
            password?: string;
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

export const getTagsSuggestions = createAsyncThunk(
    "links/get-tags-suggestions",
    async (
        data: { workspaceId: string; q: string },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/link/getTagsSuggestions", data)
            return fulfillWithValue(res.data as ApiResponseType)
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);

export const searchLinks = createAsyncThunk(
    "links/search",
    async (
        data: { workspaceId: string; q: string },
        { rejectWithValue, fulfillWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/search", data)
            return fulfillWithValue(res.data as ApiResponseType)
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiResponseType);
        }
    }
);
