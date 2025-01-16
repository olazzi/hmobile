import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {loginThunk, registerThunk, verifyOtpThunk} from './authThunks';
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
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        },
        resetSuccess: (state) => {
            state.success = false; // Reset success flag
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Fulfilled action expects a PayloadAction<LoginResponse>
            .addCase(
                loginThunk.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    state.loading = false;
                    state.user = action.payload.user;  // Ensure this matches the response structure
                    state.accessToken = action.payload.accessToken;
                }
            )
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            })
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
            .addCase(verifyOtpThunk.fulfilled, (state, action: PayloadAction<{ accessToken: string }>) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(verifyOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout,resetSuccess } = authSlice.actions;
export default authSlice.reducer;
