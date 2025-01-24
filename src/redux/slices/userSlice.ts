import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserThunk } from './userThunk'; 

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
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserThunk.pending, (state) => {
                state.loading = true; 
                state.error = null; 
            })
            .addCase(fetchUserThunk.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false; 
                state.user = action.payload; 
            })
            .addCase(fetchUserThunk.rejected, (state, action) => {
                state.loading = false; 
                state.error = action.payload as string; 
            });
    },
});

export default userSlice.reducer;
