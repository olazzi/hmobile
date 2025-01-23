import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem, getToken, removeItem } from '../config/asyncStorage.tsx'; // Assuming getToken retrieves the token
import { fetchUserThunk } from '../redux/slices/userThunk'; // Import the thunk
import { useDispatch } from 'react-redux'; // Use dispatch for the thunk
import { AppDispatch } from '../redux/store'; // Import AppDispatch from your store
import { logout } from '../redux/slices/authSlice.ts';
import {logoutThunk} from "../redux/slices/authThunks.ts";

const ProfileScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [user, setUser] = useState<any>(null); // Local state for user data
    const [loading, setLoading] = useState<boolean>(true); // Local loading state
    const [error, setError] = useState<string | null>(null); // Local error state

    // Fetch user data when the component is mounted
    useEffect(() => {
        const fetchUserData = async () => {
            const savedToken = await getToken(); // Get the saved token
            const userId = await getItem('userId'); // Get the user ID from storage

            if (savedToken && userId) {
                try {
                    setLoading(true); // Set loading state to true while fetching
                    const result = await dispatch<any>(fetchUserThunk({ userId })).unwrap(); // Dispatch thunk and unwrap the result
                    setUser(result); // Store user data in local state
                    setLoading(false); // Set loading to false once data is fetched
                } catch (err: any) {
                    setError(err.message || 'Something went wrong'); // Handle error
                    setLoading(false); // Set loading to false on error
                }
            } else {
                setError('User ID or token missing');
                setLoading(false); // Set loading to false if no token or user ID
            }
        };

        fetchUserData(); // Call the function to fetch user data
    }, [dispatch]);


    const handleLogout = async () => {
        dispatch(logoutThunk());
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
});

export default ProfileScreen;
