import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>; // This type is correct
export type AppDispatch = typeof store.dispatch; // This type is correct

export default store;
