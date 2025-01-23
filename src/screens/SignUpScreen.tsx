import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk } from '../redux/slices/authThunks';
import { RootState, AppDispatch } from '../redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { resetSuccess } from '../redux/slices/authSlice';
import { launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

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
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                );

                if (!granted) {
                    const result = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        {
                            title: 'Storage Permission Required',
                            message: 'This app needs access to your storage to select pictures.',
                            buttonPositive: 'OK',
                             buttonNegative: 'Cancel',
                        }
                    );

                    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
                        Alert.alert('Permission Denied', 'Storage permission is required to select a picture.');
                    }
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    // Request permissions on component mount
    useEffect(() => {
        requestPermissions();
    }, []);
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
 

    const handleSelectPicture = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
            });
    
            if (result.assets && result.assets.length > 0) {
                setProfilePicture(result.assets[0].uri || '');
            } else if (result.didCancel) {
                Alert.alert('Cancelled', 'Image selection was cancelled.');
            } else {
                Alert.alert('Error', 'Something went wrong during image selection.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to open image library.');
        }
    };
    

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
           <TouchableOpacity
    style={styles.imagePickerButton}
    onPress={handleSelectPicture}
>
    <Text style={styles.imagePickerText}>
        {profilePicture ? 'Change Picture' : 'Select Profile Picture'}
    </Text>
</TouchableOpacity>

{profilePicture ? (
    <Image source={{ uri: profilePicture }} style={styles.profileImage} />
) : null}


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
    imagePickerButton: {
        marginBottom: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#6200EE',
        borderRadius: 8,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
    },
});

export default SignUpScreen;
