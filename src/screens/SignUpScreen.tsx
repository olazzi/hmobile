import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk } from '../redux/slices/authThunks';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { resetSuccess } from '../redux/slices/authSlice';

const SignUpScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, success, awaitingVerification } = useSelector(
        (state: RootState) => state.auth
    );
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleRegister = () => {
        if (!email || !password || !username || !bio || !profilePicture) {
            Alert.alert('Validation Error', 'Please fill in all fields');
            return;
        }

        const userData = { email, password, username, bio, profilePicture };
        dispatch(registerThunk(userData));
    };

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error.toString() || 'Something went wrong');
        }
    }, [error]);

    useEffect(() => {
        if (success && awaitingVerification) {
            dispatch(resetSuccess());
            Alert.alert('Success', 'Account created successfully. Please verify your email.');
            navigation.navigate('OtpScreen');
        }
    }, [success, awaitingVerification, dispatch, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Your Account</Text>

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            <TextInput
                placeholder="Bio"
                value={bio}
                onChangeText={setBio}
                style={styles.input}
            />
            <TextInput
                placeholder="Profile Picture URL"
                value={profilePicture}
                onChangeText={setProfilePicture}
                style={styles.input}
            />

            <TouchableOpacity
                style={[styles.button, styles.registerButton]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Register</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.loginButton]}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingLeft: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    registerButton: {
        backgroundColor: '#6200EE',
    },
    loginButton: {
        backgroundColor: '#03DAC6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SignUpScreen;
