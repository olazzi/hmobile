import axiosInstance from './axiosInstance';

// API for login
export const loginApi = async (credentials: { email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        console.log('Login Response:', credentials);  // Log the login response
        return response.data;  // This should return an object like { token, user }
    } catch (error) {
        console.log('Login Response:', credentials);
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
