import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk } from '../redux/slices/authThunks';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { resetSuccess } from '../redux/slices/authSlice';  // Import resetSuccess

const SignUpScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, success } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleRegister = () => {
        if (!email || !password || !username || !bio || !profilePicture) {
            Alert.alert('Validation Error', 'Please fill in all fields');
            return;
        }

        const userData = { email, password, username, bio, profilePicture };
        dispatch(registerThunk(userData));  // Dispatch registration
    };

    // Listen to the error state from the Redux store
    React.useEffect(() => {
        if (error) {
            Alert.alert('Error', error.toString() || 'Something went wrong');
        }
    }, [error]);

    // Listen to the success state and navigate to OTP screen on successful registration
    React.useEffect(() => {
        if (!loading && !error && success) {
            // Reset success state before navigating to OTP screen
            dispatch(resetSuccess());

            Alert.alert('Success', 'Account created successfully');
            navigation.navigate('OtpScreen'); // Navigate to OTP screen
        }
    }, [loading, error, success, navigation, dispatch]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
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
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
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
            <Button
                title="Register"
                onPress={handleRegister}
                disabled={loading}
            />
            {loading && <Text>Loading...</Text>}
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
});

export default SignUpScreen;
