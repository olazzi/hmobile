import axios from 'axios';
import { getToken } from '../config/asyncStorage.tsx'; 


const axiosInstance = axios.create({
    baseURL: 'http://10.0.2.2:3000', 
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
            console.error('Error retrieving token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
