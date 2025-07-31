import * as SecureStore from 'expo-secure-store';

const GlobalStorage = {
    setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
    },
    getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key);
    },
    removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
    },
};

export default GlobalStorage;
