import axiosInstance from './axiosInstance';


interface UserData {
    id: string;
    name: string;
    email: string;
    bio?: string;

}

export const getUserData = async (userId: string): Promise<UserData> => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    } catch (error: any) {
        // Provide more detailed error context
        const errorMessage = error.response?.data?.message || 'Failed to fetch user data';
        console.error('Error fetching user data:', errorMessage);
        throw new Error(errorMessage);  // You could throw a custom error if needed
    }
};
