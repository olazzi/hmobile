import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OtpScreen from '../screens/OtpScreen';

const Stack = createStackNavigator();

const OtpNavigator: React.FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default OtpNavigator;
