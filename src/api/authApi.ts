import axiosInstance from './axiosInstance';
import { setItem, storeTokens} from '../config/asyncStorage.tsx';
import FormData from 'form-data';

export const loginApi = async (credentials: { email: string; password: string }) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        console.log('Login Response:', response.data); // Log the login response

        if (response.data.success) {
            const userId = response.data.user.id;
            const token = response.data.accessToken?.accessToken || null;

            if (token) {
                await storeTokens('accessToken', token);
            }
            await setItem('userId', userId);

            return {
                accessToken: token,
                user: response.data,
                isVerified: response.data.isVerified,
            };
        } else {
            console.error('User data is missing or malformed');
            throw new Error('User data is missing');
        }
    } catch (error) {
        console.error('Login API Error:', error);
        throw error;
    }
};



export const registerApi = async (userData: {
    username: string;
    email: string;
    password: string;
    bio: string;
    profilePicture: string; // Image URI
}) => {
    try {
        const formData = new FormData();

        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('bio', userData.bio);

        if (userData.profilePicture) {
            const file = {
                uri: userData.profilePicture,
                name: 'profile.jpg',
                type: 'image/jpeg',
            };
            formData.append('profilePicture', file as any); // Add profile picture to form data
        }

        const response = await axiosInstance.post('/users', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Register Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Register API Error:', error);
        throw error;
    }
};


// API for OTP verification
export const verifyOtpApi = async (otpData: { otp: string }) => {
    try {
        const response = await axiosInstance.post('/users/verify-otp', otpData);  // Adjust the endpoint as per your backend
        console.log('Verify OTP Response:', response.data);
        await setItem('userId', response.data.userId);
        await storeTokens('accessToken', response.data.accessToken);  // Log the OTP verification response
        return response.data;  // Assuming the response contains accessToken and user information
    } catch (error) {
        console.error('Verify OTP API Error:', error);  // Log error if it occurs
        throw error;  // Optionally, you can re-throw the error to handle it elsewhere
    }
};
