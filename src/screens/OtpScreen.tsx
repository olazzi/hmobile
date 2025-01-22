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

    const handleOtpSubmit = () => {
        if (!otp.trim()) {
            Alert.alert('Validation Error', 'OTP cannot be empty');
            return;
        }
        dispatch(verifyOtpThunk({ otp }));
    };

    useEffect(() => {
        if (success) {
        }
    }, [success, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
                A 6-digit OTP has been sent to your email. Please enter it below.
            </Text>

            <TextInput
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                keyboardType="number-pad"
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleOtpSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Verify OTP</Text>
                )}
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: '#B0A8B9',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default OtpScreen;
