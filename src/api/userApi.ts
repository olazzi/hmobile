import axiosInstance from './axiosInstance';

export const getUserData = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
};
