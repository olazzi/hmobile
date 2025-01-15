import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen: React.FC = () => {
    const { user, accessToken } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Profile'>>();

    const handleLogout = async () => {
        try {
            // Clear AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');

            // Clear Redux state
            dispatch(logout());

            // Navigate to Login screen
            navigation.replace('Login');
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    if (!user) {
        return <Text>Please log in.</Text>;
    }

    return (
        <View>
            <Text>Welcome, {user.name}!</Text>
            <Text>Email: {user.email}</Text>
            <Text>User ID: {user.id}</Text>
            <Text>Token: {accessToken}</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default ProfileScreen;
