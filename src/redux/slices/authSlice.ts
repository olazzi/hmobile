import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginThunk, registerThunk, verifyOtpThunk } from './authThunks';
import { LoginResponse, User, UserRegister } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    success: boolean;  // Success field for registration and login
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
            state.success = false;  // Reset success flag
            state.error = null;     // Clear error
            AsyncStorage.removeItem('user');
            AsyncStorage.removeItem('accessToken');
        },
        resetSuccess: (state) => {
            state.success = false;  // Reset success flag
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                loginThunk.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    state.loading = false;
                    state.user = action.payload.user;  // Store the user data
                    state.accessToken = action.payload.accessToken;
                    state.success = true;  // Set success on successful login
                }
            )
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
                state.success = false;  // Reset success on error
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
                state.success = true; // Indicate success for registration
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;  // Reset success on error
            })
            // OTP Verification (same as before)
            .addCase(verifyOtpThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                verifyOtpThunk.fulfilled,
                (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
                    state.loading = false;
                    state.accessToken = action.payload.accessToken;
                    state.user = action.payload.user; // Store the user data
                    state.success = true; // Mark OTP verification success
                }
            )

            .addCase(verifyOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;  // Reset success on OTP error
            });
    },
});

export const { logout, resetSuccess } = authSlice.actions;
export default authSlice.reducer;
