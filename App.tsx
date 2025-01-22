import React, { useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Router from './route';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { ThemeProvider } from './src/context/ThemeContext.tsx';
import { initializeAuthState } from './src/redux/slices/authSlice'; // Import the initializeAuthState action

const InitializeAuth: React.FC = () => {
    const dispatch = store.dispatch;

    useEffect(() => {
        // Dispatch the action to initialize the authentication state from AsyncStorage
        dispatch(initializeAuthState());
    }, [dispatch]);

    return null;
};

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <Provider store={store}>
            <ThemeProvider>
                <View style={styles.sectionContainer}>
                    {/* Add InitializeAuth component to dispatch the initialization action */}
                    <InitializeAuth />
                    <Router />
                </View>
            </ThemeProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        flex: 1,
    },
});

export default App;
