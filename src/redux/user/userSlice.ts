import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Change to your local server's base URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add interceptors for token handling
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Adjust storage logic (e.g., AsyncStorage for React Native)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
