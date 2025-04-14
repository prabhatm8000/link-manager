import { createSlice } from "@reduxjs/toolkit";
import {
    login,
    logout,
    registerAndSendOtp,
    registerAndVerifyOtp,
    resendOtp,
    updateUser,
    verifyUser,
} from "../thunks/usersThunk";
import type { ApiResponseType, IUser, IUserState } from "./types";

const initialState: IUserState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
    isOtpSent: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearState: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.message = null;
            state.isOtpSent = false;
        },
    },
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
            state.isAuthenticated = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
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
            state.message = (action.payload as ApiResponseType).message;
        });

        // logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
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
            state.message = (action.payload as ApiResponseType).message;
            state.isOtpSent = false;
        });

        // resend otp
        builder.addCase(resendOtp.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.loading = false;
            state.error = null;
            state.message = null;
            state.isOtpSent = true;
        });
        builder.addCase(resendOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
            state.isOtpSent = false;
        });
        builder.addCase(resendOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
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
            state.message = (action.payload as ApiResponseType).message;
        });

        // update user
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });
    },
});

export default userSlice.reducer;
