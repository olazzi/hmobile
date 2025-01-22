import AsyncStorage from '@react-native-async-storage/async-storage';


// Function to store a theme value ('dark' or 'light')
export const storeData = async (key: string, value: 'dark' | 'light') => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error: any) {
        console.error("Error storing theme:", error);
    }
};

// Function to store tokens (e.g., JWT token)
export const storeTokens = async (key: string, value: string) => {
    try {
        // Ensure value is a string
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, valueToStore);
    } catch (error: any) {
        console.error("Error storing token:", error);
    }
};

// Function to get stored data (generic for any key)
export const getData = async (key: string) => {
    try {
        let value = await AsyncStorage.getItem(key);
        if (value) {
            return value;
        } else {
            return null;
        }
    } catch (error: any) {
        console.error("Error getting data:", error);
        return null;
    }
};





// Function to get the stored token (JWT or any other token)
export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            return token;
        } else {
            return null;  // Return null if no token is found
        }
    } catch (error: any) {
        console.error("Error getting token:", error);
        return null;  // Return null if there's an error
    }
};
