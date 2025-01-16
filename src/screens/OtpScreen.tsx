import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
        if (!otp.trim()) {
            return;
        }
        dispatch(verifyOtpThunk({ otp })); // Dispatch OTP verification
    };

    // Navigate to the profile page upon successful OTP verification
    useEffect(() => {
        if (success) {
            navigation.navigate('Profile'); // Navigate to Profile screen
        }
    }, [success, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>
            <TextInput
                placeholder="Enter OTP"
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
            {loading && <Text style={styles.loading}>Verifying OTP...</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
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
    loading: {
        color: 'blue',
        marginTop: 10,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});

export default OtpScreen;
