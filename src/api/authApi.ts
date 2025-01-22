import axiosInstance from './axiosInstance';
import {storeTokens} from '../config/asyncStorage.tsx';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginApi = async (credentials: { email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        console.log('Login Response:', response.data);  // Log the login response

        // If login is successful, get the user details using the access token
        if (response.data.success && response.data.accessToken) {
            const token = response.data.accessToken.accessToken; // Get the token
            console.log('Access Token:', token);

            // Use the correct URL with userId instead of '/users/me'
            const userId = response.data.user.id;  // Assuming the user ID is included in the login response
            const userResponse = await axiosInstance.get(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('User Response:', userResponse.data);  // Log the user data
            const userData = userResponse.data;

            // Check if user data exists
            if (userData && userData.id) {
                // Store the user and token in AsyncStorage
                await AsyncStorage.setItem('userId', userData.id);
                await storeTokens('accessToken', token); // Assuming storeTokens saves the token

                return {
                    accessToken: token,
                    user: userData,
                    isVerified: userData.isVerified,
                };
            } else {
                console.error('User data is missing or malformed');
                throw new Error('User data is missing');
            }
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Login API Error:', error);
        throw error;
    }
};


// API for register
export const registerApi = async (userData: { username: string; email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/users', userData);
        console.log('Register Response:', response.data); // Log the register response
        return response.data;
    } catch (error) {
        console.error('Register API Error:', error); // Log error if it occurs
        throw error; // Optionally, you can re-throw the error to handle it elsewhere
    }
};

// API for OTP verification
export const verifyOtpApi = async (otpData: { otp: string }) => {
    try {
        const response = await axiosInstance.post('/users/verify-otp', otpData);  // Adjust the endpoint as per your backend
        console.log('Verify OTP Response:', response.data);  // Log the OTP verification response
        return response.data;  // Assuming the response contains accessToken and user information
    } catch (error) {
        console.error('Verify OTP API Error:', error);  // Log error if it occurs
        throw error;  // Optionally, you can re-throw the error to handle it elsewhere
    }
};
