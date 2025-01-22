import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import OtpNavigator from './OtpNavigator';
import { ActivityIndicator, View } from 'react-native';

const RootNavigator: React.FC = () => {
    const { success: isAuthenticated, awaitingVerification, accessToken, isVerified, loading } = useSelector(
        (state: RootState) => state.auth
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const shouldShowOtpNavigator = awaitingVerification && !isVerified;

    // Log state values for debugging
    console.log('isAuthenticated:', isAuthenticated);
    console.log('accessToken:', accessToken);
    console.log('isVerified:', isVerified);
    console.log('awaitingVerification:', awaitingVerification);

    return (
        <NavigationContainer>
            {isAuthenticated && accessToken && isVerified ? (
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
