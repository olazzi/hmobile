import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer, // This should be correctly imported from the authSlice file
    },
});

export type RootState = ReturnType<typeof store.getState>; // This type is correct
export type AppDispatch = typeof store.dispatch; // This type is correct

export default store;
