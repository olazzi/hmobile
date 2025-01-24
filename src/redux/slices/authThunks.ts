    import { createAsyncThunk} from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import {loginApi, registerApi, verifyOtpApi} from '../../api/authApi';  // Make sure to import the register API function
import {LoginCredentials, LoginResponse, User, RegisterCredentials, UserRegister} from '../types';
import { JwtPayload as JWT } from 'jwt-decode';
    import {AxiosError} from "axios";
    import {removeItem} from "../../config/asyncStorage.tsx";
    import {logout} from "./authSlice.ts"; // Importing base JwtPayload type

interface ExtendedJwtPayload extends JWT {
    sub: string; // User ID (ensure it's a string)
    username: string; // Assuming your token contains 'username'
    email: string; // Add any other fields your token might have
}

    export const loginThunk = createAsyncThunk<LoginResponse, LoginCredentials>(
        'auth/login',
        async (credentials, { rejectWithValue }) => {
            try {
                // Call the login API
                const response = await loginApi(credentials);
                const { accessToken, isVerified } = response;

                // Check if the token exists and extract it
                const token = accessToken;
                if (!token) {
                    throw new Error('Access token is missing.');
                }

                console.log('Login Response:', response);

                // Decode the token to get user details
                const decodedToken = jwtDecode<ExtendedJwtPayload>(token);

                const user: User = {
                    id: decodedToken.sub || '',
                    name: decodedToken.username || '',
                    email: decodedToken.email || '',
                };

                // Return the data as a `LoginResponse` type
                return { accessToken: token, user, isVerified };
            } catch (error) {
                console.error('Login Thunk Error:', error);

                // Handle Axios-specific errors
                if ((error as AxiosError).isAxiosError) {
                    const axiosError = error as AxiosError;
                    return rejectWithValue(
                         axiosError.message || 'An error occurred.'
                    );
                }

                // Handle generic errors
                return rejectWithValue((error as Error).message || 'An unknown error occurred.');
            }
        }
    );



// Register Thunk
export const registerThunk = createAsyncThunk<UserRegister, RegisterCredentials>(
    'user/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await registerApi(credentials);

            const user: UserRegister = {
                id: response.id || '',
                name: response.username || '',
                email: response.email || '',
                bio: credentials.bio, 
                profilePicture: credentials.profilePicture, 
            };

            return user;
        } catch (error: any) {
            console.error('Register API Error:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const verifyOtpThunk = createAsyncThunk<LoginResponse, { otp: string }>(
    'user/verify-otp',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await verifyOtpApi(otpData);  
            const { accessToken: token } = response; 

            const decodedToken = jwtDecode<ExtendedJwtPayload>(token);

            const user: User = {
                id: decodedToken.sub || '',
                name: decodedToken.username || '',
                email: decodedToken.email || '',
            };

            
            return { accessToken: token, user } as LoginResponse;
        } catch (error: any) {
            console.error('OTP Verification API Error:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
    export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
        try {
            await removeItem('user');
            await removeItem('accessToken');
            await removeItem('isVerified');
            
            dispatch(logout());
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    });
