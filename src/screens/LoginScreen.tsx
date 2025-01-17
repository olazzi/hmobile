import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../redux/slices/authThunks';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';


type LoginCredentials = {
    email: string;
    password: string;
};

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
    const navigation = useNavigation<NavigationProp>();
    const [isVerifiedLocal, setIsVerifiedLocal] = useState(false);
    const handleLogin = async () => {
        // Create the login credentials object
        const credentials: LoginCredentials = {
            email,
            password,
        };

        try {
            // Dispatch the login thunk
            const action = await dispatch(loginThunk(credentials));

            // Check if login was successful and if the user is verified
            if (loginThunk.fulfilled.match(action)) {
                const { user, isVerified } = action.payload;
console.log('us--------------------------------------------------er',user)
                setIsVerifiedLocal(isVerified);
                // If the user is verified, navigate to the main app screen
                if (isVerified) {
                    // Navigate to the main screen (e.g., HomeScreen or Dashboard)
                    navigation.navigate('Profile'); // Adjust the screen name accordingly
                }

            }  else if(loginThunk.rejected.match(action) && !isVerifiedLocal){

                Alert.alert('Verification Needed', 'Please verify your email before logging in.');
                navigation.navigate('OtpScreen'); // Adjust screen name as needed
            } else {
                // If the login action is rejected, show the error message
                Alert.alert('Login Fasiled' || 'Something went wrong!');
            }
        } catch (err) {
            console.error('Login error:', err);
            Alert.alert('Error', 'An error occurred during login. Please try again.');
        }
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
