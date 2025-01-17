import { createAsyncThunk} from '@reduxjs/toolkit';
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
            const response = await loginApi(credentials); // API call for login
            const { accessToken, isVerified } = response;

            // Extract the actual token (assuming accessToken is an object with a `accessToken` field)
            const token = accessToken?.accessToken;

            console.log('Login ResponseisVerified:', isVerified);  // Log the login response

            // Check if token exists
            if (!token) {
                return rejectWithValue({ message: 'Access token is missing.' });
            }

            // If verified, decode the token and return the user and token
            const decodedToken = jwtDecode<ExtendedJwtPayload>(token);

            const user: User = {
                id: decodedToken.sub || '',
                name: decodedToken.username || '',
                email: decodedToken.email || '',
            };

            // Return the data as a LoginResponse type, including the verification status
            return { accessToken: token, user, isVerified } as LoginResponse; // Explicitly include isVerified
        } catch (error: any) {
            console.error('Login  thunnk error thunk Error:', error);

            // Handle error by rejecting with the message
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
    'user/verify-otp',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await verifyOtpApi(otpData);  // Call the API to verify the OTP
            const { accessToken: token } = response; // Destructure accessToken and assign it to 'token'

            const decodedToken = jwtDecode<ExtendedJwtPayload>(token);

            const user: User = {
                id: decodedToken.sub || '',
                name: decodedToken.username || '',
                email: decodedToken.email || '',
            };

            // Return the data as a LoginResponse type
            return { accessToken: token, user } as LoginResponse;
        } catch (error: any) {
            console.error('OTP Verification API Error:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

