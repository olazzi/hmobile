import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

import HomeIcon from '../assets/HomeIcon.tsx';
import SettingIcon from '../assets/SettingsIcon.tsx';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    if (route.name === 'Home') {
                        return <HomeIcon color={focused ? 'tomato' : 'gray'} />;
                    } else if (route.name === 'Profile') {
                        return <SettingIcon color={focused ? 'tomato' : 'gray'} />;
                    }
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }}/>
            <Tab.Screen name="Profile" options={{ headerShown: false }}>
                {props => <ProfileScreen />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
