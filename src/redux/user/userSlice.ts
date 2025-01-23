import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from '../../config/asyncStorage.tsx';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Adjust to your backend's base URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors for token handling
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await getToken(); // Get token from AsyncStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
            }
        } catch (error) {
            console.error('Error reading token from storage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // Handle request error
    }
);

axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses through
    (error) => {
        // Optional: Handle token expiration or unauthorized errors
        if (error.response?.status === 401) {
            console.warn('Unauthorized! Redirecting to login...');
            // Optionally, clear token or redirect user to login
        }
        return Promise.reject(error); // Handle response error
    }
);

export default axiosInstance;
