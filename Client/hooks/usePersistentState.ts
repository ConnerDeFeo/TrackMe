import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

// Generic custom hook that provides persistent state using AsyncStorage
// T represents the type of data being stored
// Returns [state, setState, isLoading] with proper typing
const usePersistentState = <T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean] => {
    // Local state to hold the current value
    const [state, setState] = useState<T>(defaultValue);
    // Loading state to track when initial data is being loaded from storage
    const [isLoading, setIsLoading] = useState(true);

    // Effect to load saved data from AsyncStorage on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                // Retrieve stored value using the provided key
                const jsonValue = await AsyncStorage.getItem(key);
                const savedData = jsonValue != null ? JSON.parse(jsonValue) : null;
                
                // Only update state if we found saved data
                if (savedData !== null) {
                    setState(savedData);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                // Mark loading as complete regardless of success/failure
                setIsLoading(false);
            }
        };

        loadData();
    }, [key]); // Re-run if the storage key changes

    // Effect to save state changes to AsyncStorage
    useEffect(() => {
        // Only save after initial loading is complete to avoid overwriting with default value
        if (!isLoading) {
            const saveData = async () => {
                try {
                    // Convert state to JSON string and save to AsyncStorage
                    const jsonValue = JSON.stringify(state);
                    await AsyncStorage.setItem(key, jsonValue);
                } catch (error) {
                    console.error('Error saving data', error);
                }
            };
            saveData();
        }
    }, [key, state, isLoading]); // Re-run when key, state, or loading status changes

    // Return state value, setter function, and loading status with proper types
    return [state, setState, isLoading];
};

export default usePersistentState;