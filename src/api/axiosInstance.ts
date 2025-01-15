import axios from 'axios';
import { getToken } from '../config/asyncStorage.tsx'; // Adjust the import path

// Update the baseURL to point to localhost:3000
const axiosInstance = axios.create({
    baseURL: 'http://10.0.2.2:3000', // Change to your local server's base URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors for token handling
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await getToken(); // Use the getToken function to retrieve token from AsyncStorage
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error retrieving token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
