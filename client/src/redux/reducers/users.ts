import { createSlice } from "@reduxjs/toolkit";
import {
    login,
    registerAndSendOtp,
    registerAndVerifyOtp,
    verifyUser,
} from "../thunks/usersThunk";
import type { IUser, IUserState } from "./types";

const initialState: IUserState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
    isOtpSent: false,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // verifyUser
        builder.addCase(verifyUser.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(verifyUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(verifyUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as IUserState).message;
        });

        // login
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as IUserState).message;
        });

        // register and otpSend
        builder.addCase(registerAndSendOtp.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.loading = false;
            state.error = null;
            state.message = null;
            state.isOtpSent = true;
        });
        builder.addCase(registerAndSendOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
            state.isOtpSent = false;
        });
        builder.addCase(registerAndSendOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as IUserState).message;
            state.isOtpSent = false;
        });

        // register and verify otp
        builder.addCase(registerAndVerifyOtp.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            state.message = null;
            state.isOtpSent = false;
        });
        builder.addCase(registerAndVerifyOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(registerAndVerifyOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as IUserState).message;
        });
    },
});

export default usersSlice.reducer;
