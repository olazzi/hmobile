// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OtpScreen from '../screens/OtpScreen';

export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    OtpScreen: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login"  options={{ headerShown: false }}>
                {(props) => <LoginScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
    );
};

export default AuthNavigator;
