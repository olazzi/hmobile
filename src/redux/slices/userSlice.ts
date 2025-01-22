import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserThunk } from './userThunk'; // Import the async thunk

interface UserState {
    user: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Optional: you could add manual actions if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserThunk.pending, (state) => {
                state.loading = true; // Set loading to true when the request starts
                state.error = null; // Clear previous errors
            })
            .addCase(fetchUserThunk.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false; // Set loading to false once the request is successful
                state.user = action.payload; // Store user data
            })
            .addCase(fetchUserThunk.rejected, (state, action) => {
                state.loading = false; // Set loading to false when the request fails
                state.error = action.payload as string; // Store the error message
            });
    },
});

export default userSlice.reducer;
