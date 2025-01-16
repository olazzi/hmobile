import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../redux/slices/authThunks';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator.tsx';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginCredentials = {
    email: string;
    password: string;
};

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, accessToken, user } = useSelector((state: RootState) => state.auth);

    type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
    const navigation = useNavigation<NavigationProp>();

    React.useEffect(() => {
        if (accessToken && user) {
            navigation.navigate('Profile');
        }
    }, [accessToken, user, navigation]);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Validation Error', 'Please fill i n all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email');
            return;
        }

        const credentials: LoginCredentials = { email, password };
        dispatch(loginThunk(credentials));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button
                title="Login"
                onPress={handleLogin}
                disabled={loading}
            />
            {loading && <Text>Loading...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    signupText: {
        color: 'blue',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default LoginScreen;
