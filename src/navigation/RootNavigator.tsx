import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import OtpNavigator from './OtpNavigator';
import { ActivityIndicator, View } from 'react-native';
import {getItem, getToken} from "../config/asyncStorage.tsx";
import {setAccessToken, setIsVerified,} from '../redux/slices/authSlice.ts';


const RootNavigator: React.FC = () => {
    const dispatch = useDispatch();
    const [isInitializing, setIsInitializing] = useState(true);
    const [isVerifiedFromStorage, setIsVerifiedFromStorage] = useState<boolean | null>(null);
    const { isAuthenticated, awaitingVerification, accessToken, isVerified, loading } = useSelector(
        (state: RootState) => state.auth
    );

    // Check if the user is authenticated when the app starts
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = await getToken();
                const isVerifiedStorage = await getItem('isVerified'); // Retrieve `isVerified` from async storage


                // Update state and Redux based on the token and `isVerified`
                if (token) {
                    dispatch(setAccessToken(token));
                }

                if (isVerifiedStorage) {
                    setIsVerifiedFromStorage(isVerifiedStorage); // Updates local state// Update Redux state
                } else {

                    setIsVerifiedFromStorage(false); // Default to `false` if not found
                }
            } catch (error) {
                console.error('Error initializing auth state:', error);
            }finally {
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, [dispatch]);

    if (loading || isInitializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const shouldShowOtpNavigator = awaitingVerification && !isVerified;
    const shouldShowAppNavigator= isVerified || isVerifiedFromStorage;
  
    return (
        <NavigationContainer>
            {isAuthenticated && accessToken && shouldShowAppNavigator ? (
                <AppNavigator />
            ) : shouldShowOtpNavigator ? (
                <OtpNavigator />
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
};

export default RootNavigator;
