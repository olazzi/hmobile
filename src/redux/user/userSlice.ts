import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from '../../config/asyncStorage.tsx';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error reading token from storage:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Unauthorized! Redirecting to login...');
        }
        return Promise.reject(error); 
    }
);

export default axiosInstance;
