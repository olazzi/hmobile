import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../redux/slices/authThunks';
import { RootState, AppDispatch } from '../redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        const credentials = { email, password };

        try {
            const action = await dispatch(loginThunk(credentials));

            if (loginThunk.fulfilled.match(action)) {

            } else {

            }
        } catch (err) {
            console.error('Login error:', err);
            Alert.alert('Error', 'An error occurred during login.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

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
                secureTextEntry
                style={styles.input}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#6200EE" style={styles.loadingIndicator} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign up</Text></Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#6200EE',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    loadingIndicator: {
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    signupText: {
        fontSize: 14,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
    signupLink: {
        color: '#6200EE',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
