import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem, getToken } from '../config/asyncStorage'; 
import { fetchUserThunk } from '../redux/slices/userThunk'; 
import { useDispatch } from 'react-redux'; 
import { AppDispatch } from '../redux/store'; 
import { logoutThunk } from "../redux/slices/authThunks"; 

const ProfileScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [user, setUser] = useState<any>(null); 
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null); 

    
    useEffect(() => {
        const fetchUserData = async () => {
            const savedToken = await getToken(); 
            const userId = await getItem('userId'); 

            if (savedToken && userId) {
                try {
                    setLoading(true); 
                    const result = await dispatch<any>(fetchUserThunk({ userId })).unwrap();
                    setUser(result); 
                    setLoading(false); 
                } catch (err: any) {
                    setError(err.message || 'Something went wrong'); 
                    setLoading(false); 
                }
            } else {
                setError('User ID or token missing');
                setLoading(false); 
            }
        };

        fetchUserData(); 
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
                    {user.profilePicture ? (
                        <Image
                            source={{ uri: user.profilePicture }}
                            style={styles.profilePicture}
                        />
                    ) : (
                        <Text>No profile picture available</Text>
                    )}
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
    profilePicture: {
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        marginBottom: 16, 
    },
});

export default ProfileScreen;
