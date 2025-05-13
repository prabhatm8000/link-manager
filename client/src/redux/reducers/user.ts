import { createSlice } from "@reduxjs/toolkit";
import {
    cancelVerification,
    deleteUser,
    login,
    logout,
    registerUser,
    resendVerification,
    resetPassword,
    sendPasswordReset,
    updateUser,
    verifyUser,
    verifyUserEmail
} from "../thunks/usersThunk";
import type { ApiResponseType, IUser, IUserState } from "./types";

const initialState: IUserState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
    isVerificationSent: false,
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
            state.isVerificationSent = false;
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

        // send password reset
        builder.addCase(sendPasswordReset.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        })
        builder.addCase(sendPasswordReset.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        builder.addCase(sendPasswordReset.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        })

        // reset password
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });

        // registerUser
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.loading = false;
            state.error = null;
            state.message = null;
            state.isVerificationSent = true;
        });
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
            state.isVerificationSent = false;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
            state.isVerificationSent = false;
        });
        
        // resendVerification
        builder.addCase(resendVerification.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
            state.isVerificationSent = true;
        });
        builder.addCase(resendVerification.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
            state.isVerificationSent = false;
        });
        builder.addCase(resendVerification.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
            state.isVerificationSent = false;
        });

        // verify user email
        builder.addCase(verifyUserEmail.fulfilled, (state, action) => {
            state.user = action.payload.data as IUser;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            state.message = null;
            state.isVerificationSent = false;
        });
        builder.addCase(verifyUserEmail.pending, (state) => {
            state.loading = true;
            state.isAuthenticated = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(verifyUserEmail.rejected, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });

        // cancel verification
        builder.addCase(cancelVerification.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(cancelVerification.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(cancelVerification.rejected, (state, action) => {
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
        
        // delete user and logout
        builder.addCase(deleteUser.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.message = null;
        });
        builder.addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
            state.message = (action.payload as ApiResponseType).message;
        });
    },
});

export default userSlice.reducer;
