import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { fetchUserThunk } from '../redux/slices/userThunk'; // Import the thunk
import { AppDispatch, RootState } from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../config/asyncStorage.tsx';

const ProfileScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading, error } = useSelector((state: RootState) => state.user);
    const [token, setToken] = useState<string | null>(null); // State to store the token for testing

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = await AsyncStorage.getItem('userId');
            const savedToken = await getToken();
            console.log("---------------------------------", userId);
            console.log("--------------------------------2-", savedToken);
            setToken(savedToken); // Set token to state for testing purposes

            if (userId && savedToken) {
                dispatch(fetchUserThunk({ userId, token: savedToken })); // Pass an object instead of two separate arguments
            }
        };

        (async () => {
            await fetchUserData();
        })();
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            dispatch(logout());
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>Error: {error}</Text>
            ) : user ? (
                <>
                    <Text style={styles.title}>Welcome, {user.username}!</Text>
                    <Text>Email: {user.email}</Text>
                    <Text>Bio: {user.bio}</Text>
                    <Text>User ID: {user.id}</Text>
                    <Button title="Logout" onPress={handleLogout} />
                </>
            ) : (
                <Text>Please log in.</Text>
            )}
            <Text style={styles.token}>Token: {token}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    token: {
        marginTop: 20,
        fontSize: 14,
        color: 'gray',
    },
});

export default ProfileScreen;
