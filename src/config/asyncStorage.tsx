import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to store any generic value in AsyncStorage
export const setItem = async (key: string, value: any) => {
    try {
        // Ensure value is a string, otherwise serialize it
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, valueToStore);
    } catch (error: any) {
        console.error(`Error storing data for key "${key}":`, error);
    }
};

// Function to retrieve any generic value from AsyncStorage
export const getItem = async (key: string) => {
    try {
        let value = await AsyncStorage.getItem(key);
        if (value) {
            // Try parsing as JSON if the value is not a string
            try {
                return JSON.parse(value);
            } catch (error) {
                return value; // Return the string if parsing fails
            }
        } else {
            return null;
        }
    } catch (error: any) {
        console.error(`Error getting data for key "${key}":`, error);
        return null;  // Return null if there's an error
    }
};

export const removeItem = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error: any) {
        console.error(`Error removing data for key "${key}":`, error);
    }
};

// Function to store tokens (e.g., JWT token)
export const storeTokens = async (key: string, value: string) => {
    try {
        await setItem(key, value);
    } catch (error: any) {
        console.error("Error storing token:", error);
    }
};

// Function to get the stored token (JWT or any other token)
export const getToken = async () => {
    try {
        return await getItem('accessToken');
    } catch (error: any) {
        console.error("Error getting token:", error);
        return null;
    }
};
