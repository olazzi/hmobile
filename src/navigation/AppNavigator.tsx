import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import OtpScreen from '../screens/OtpScreen';

export type RootStackParamList = {
    MainTabs: undefined;
    Profile: undefined;
    OtpScreen: undefined;
    Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator initialRouteName="MainTabs">
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
                name="Profile"
                options={{ headerShown: false }}
            >
                {(props) => <ProfileScreen />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default AppNavigator;
