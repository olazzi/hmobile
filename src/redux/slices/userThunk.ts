import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserData } from '../../api/userApi.ts';


export const fetchUserThunk = createAsyncThunk(
    'user/fetchUser', 
    async ({ userId }: { userId: string }) => { 
        try {
            const userData = await getUserData(userId); 
            return userData; 
        } catch (error: unknown) { 
            if (error instanceof Error) {
                throw new Error(error.message || 'Failed to fetch user data');
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }
);
