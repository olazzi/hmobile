import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtpThunk } from '../redux/slices/authThunks';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const OtpScreen: React.FC = () => {
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, success } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    // Handle OTP submission
    const handleOtpSubmit = () => {
        if (!otp) {
            Alert.alert('Validation Error', 'Please enter the OTP');
            return;
        }

        const otpData = { otp };
        dispatch(verifyOtpThunk(otpData));  // Dispatch OTP verification
    };

    // Handle success and errors after the dispatch
    useEffect(() => {
        if (error) {
            Alert.alert('Error', error.toString() || 'Something went wrong');
        }
    }, [error]);

    // If verification is successful and loading is false, navigate to the login page
    useEffect(() => {
        if (!loading && success) {
            Alert.alert('Success', 'OTP verified successfully');
            navigation.navigate('Login'); // Navigate to the Login screen
        }
    }, [loading, success, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <TextInput
                placeholder="OTP"
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                keyboardType="number-pad"
            />
            <Button
                title="Verify OTP"
                onPress={handleOtpSubmit}
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

export default OtpScreen;
