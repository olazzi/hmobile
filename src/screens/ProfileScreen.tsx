import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
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
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                <View style={styles.topSection}>
                    <Image
                        source={{ uri: user.profilePicture }}
                        style={styles.profilePicture}
                    />
                    <Text style={styles.title}>{user.username}</Text>
                </View>
                <View style={styles.middleSection}>
                    <Text style={styles.bio}>{user.bio}</Text>
                </View>
                <View style={styles.bottomSection}>
                    <Text style={styles.infoText}>Email: {user.email}</Text>
                    <Text style={styles.infoText}>User ID: {user.id}</Text>
                </View>
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
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    topSection: {
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    middleSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    bottomSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    bio: {
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 16,
        color: '#666',
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    logoutButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#ff5c5c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        zIndex: 1,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;
