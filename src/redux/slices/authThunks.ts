import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import {loginApi, registerApi, verifyOtpApi} from '../../api/authApi';  // Make sure to import the register API function
import {LoginCredentials, LoginResponse, User, RegisterCredentials, UserRegister} from '../types';
import { JwtPayload as JWT } from 'jwt-decode'; // Importing base JwtPayload type

interface ExtendedJwtPayload extends JWT {
    sub: string; // User ID (ensure it's a string)
    username: string; // Assuming your token contains 'username'
    email: string; // Add any other fields your token might have
}

// Login Thunk (same as your existing login)
export const loginThunk = createAsyncThunk<LoginResponse, LoginCredentials>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginApi(credentials);
            const token = response.accessToken;
            const decodedToken = jwtDecode<ExtendedJwtPayload>(token);

            const user: User = {
                id: decodedToken.sub || '',
                name: decodedToken.username || '',
                email: decodedToken.email || '',
            };

            return { accessToken: token, user };
        } catch (error: any) {
            console.error('Login API Error:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Register Thunk
export const registerThunk = createAsyncThunk<UserRegister, RegisterCredentials>(
    'user/register',  // It's better to make the action type more specific
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await registerApi(credentials);  // Call the API to register the user

            // Create the user object using the provided credentials and response data
            const user: UserRegister = {
                id: response.id || '',  // Assuming response contains user ID
                name: response.username || '',
                email: response.email || '',
                bio: credentials.bio, // Adding bio from the credentials
                profilePicture: credentials.profilePicture, // Adding profilePicture from the credentials
            };

            return user;  // Return the user object directly without the token
        } catch (error: any) {
            console.error('Register API Error:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
export const verifyOtpThunk = createAsyncThunk<LoginResponse, { otp: string }>(
    'auth/verifyOtp',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await verifyOtpApi(otpData);  // Call the API to verify the OTP
            const token = response.accessToken; // Assume the token is returned if OTP is correct
            const decodedToken = jwtDecode<ExtendedJwtPayload>(token);

            const user: User = {
                id: decodedToken.sub || '',
                name: decodedToken.username || '',
                email: decodedToken.email || '',

            };

            return { accessToken: token, user };
        } catch (error: any) {
            console.error('OTP Verification API Error:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
