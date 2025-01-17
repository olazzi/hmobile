import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OtpScreen from '../screens/OtpScreen';

export type RootStackParamList = {
    Login: undefined;
    Profile: undefined;
    SignUp: undefined;
    OtpScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
    <NavigationContainer >
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
