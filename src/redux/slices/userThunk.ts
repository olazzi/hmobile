import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserData } from '../../api/userApi.ts'; // Import the getUserData function

// Define the async thunk using createAsyncThunk
export const fetchUserThunk = createAsyncThunk(
    'user/fetchUser', // This is the action type that will be automatically created
    async ({ userId }: { userId: string }) => { // Removed token since it's not being used
        try {
            const userData = await getUserData(userId); // Fetch the user data using your API function
            return userData; // Return the user data as the payload
        } catch (error: unknown) { // Specify error as type 'unknown'
            if (error instanceof Error) {
                // Type narrow to 'Error' to safely access 'message'
                throw new Error(error.message || 'Failed to fetch user data');
            } else {
                // If it's not an instance of Error, provide a fallback message
                throw new Error('An unknown error occurred');
            }
        }
    }
);
