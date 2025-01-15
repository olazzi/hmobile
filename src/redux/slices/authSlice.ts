import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  registerThunk, verifyOtpThunk } from './authThunks';
import {LoginResponse, User, UserRegister} from '../types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    success: boolean;  // Add success field
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    success: false,  // Initialize success to false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
        },
        resetSuccess: (state) => {
            state.success = false; // Reset success flag
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false; // Reset success on new registration attempt
            })
            .addCase(registerThunk.fulfilled, (state, action: PayloadAction<UserRegister>) => {
                state.loading = false;
                state.user = action.payload; // Store the user data
                state.success = true; // Indicate success
                // No need to store accessToken since we're not using it here
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            // OTP Verification (same as before)
            .addCase(verifyOtpThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtpThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout,resetSuccess } = authSlice.actions;
export default authSlice.reducer;
