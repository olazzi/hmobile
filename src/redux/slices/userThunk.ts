import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"; // Your API function

// Define the async thunk using createAsyncThunk
export const fetchUserThunk = createAsyncThunk(
    'user/fetchUser', // This is the action type that will be automatically created
    async ({ userId, token }: { userId: string; token: string | null }) => {
        const response = await axios.get(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // This will be the payload in the fulfilled action
    }
);
