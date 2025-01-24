import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginThunk, registerThunk, verifyOtpThunk } from './authThunks';
import { LoginResponse, User, UserRegister } from '../types';
import {getItem, getToken, removeItem, setItem} from "../../config/asyncStorage.tsx";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    success: boolean;
    awaitingVerification: boolean;
    isVerified:boolean;
    isAuthenticated:boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    success: false,
    awaitingVerification: false,
    isVerified: false,
    isAuthenticated:false,
};

export const initializeAuthState = () => async (dispatch: any) => {
    try {
        const token = await getToken();
        const isVerified = await getItem('isVerified');
        console.log('Retrieved isVerified from storage:', isVerified);

        if (token) {
            dispatch(setAccessToken(token));
            dispatch(setIsAuthenticated(true));

            if (isVerified === 'true') {
                dispatch(setIsVerified(true));
            } else {
                dispatch(setIsVerified(false));
            }
        }
    } catch (error) {
        console.error('Error initializing auth state:', error);
    }
};



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.success = false;
            state.awaitingVerification = false;
            state.error = null;
            state.isVerified = false;
            state.isAuthenticated = false;
        },
        resetSuccess: (state) => {
            state.success = false;  
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload; 
        },
        setIsVerified: (state, action: PayloadAction<boolean>) => {
            state.isVerified = action.payload; 
        },
    },
    extraReducers: (builder) => {
        builder
           
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.awaitingVerification = true;
            })
            .addCase(
                loginThunk.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    const { user, accessToken, isVerified } = action.payload;
                    state.loading = false;
                    state.user = user;
                    state.accessToken = accessToken;
                    state.success = true;
                    state.isAuthenticated = true;
                    state.isVerified = isVerified;
                    state.awaitingVerification = !isVerified;

                    setItem('isVerified', isVerified.toString());
                }
            )
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
                state.success = false;  
            })
          
            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false; 
            })
            .addCase(registerThunk.fulfilled, (state, action: PayloadAction<UserRegister>) => {
                state.loading = false;
                state.user = action.payload; 
                state.success = true; 
                state.awaitingVerification = true; 

            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false; 
            })
            
            .addCase(verifyOtpThunk.pending, (state) => {
                state.loading = true;
                state.error = null;

            })
            .addCase(
                verifyOtpThunk.fulfilled,
                (state, action: PayloadAction<{
                    isVerified: any;
                    accessToken: string; user: User }>) => {

                    state.loading = false;
                    state.accessToken = action.payload.accessToken;
                    state.user = action.payload.user;
                    state.awaitingVerification = false;
                    state.isVerified = true;
                    state.success = true;
                    state.isAuthenticated = true;
                }
            )
            .addCase(verifyOtpThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;  
            });
    },
});

export const { logout, resetSuccess, setUser, setAccessToken, setIsAuthenticated,setIsVerified  } = authSlice.actions;
export default authSlice.reducer;
