import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: string, value: any) => {
    try {
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, valueToStore);
    } catch (error: any) {
        console.error(`Error storing data for key "${key}":`, error);
    }
};

export const getItem = async (key: string) => {
    try {
        let value = await AsyncStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (error) {
                return value;
            }
        } else {
            return null;
        }
    } catch (error: any) {
        console.error(`Error getting data for key "${key}":`, error);
        return null;  
    }
};

export const removeItem = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error: any) {
        console.error(`Error removing data for key "${key}":`, error);
    }
};


export const storeTokens = async (key: string, value: string) => {
    try {
        await setItem(key, value);
    } catch (error: any) {
        console.error("Error storing token:", error);
    }
};


export const getToken = async () => {
    try {
        return await getItem('accessToken');
    } catch (error: any) {
        console.error("Error getting token:", error);
        return null;
    }
};
