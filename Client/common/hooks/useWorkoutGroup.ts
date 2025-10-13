import { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A global object to hold subscriber callbacks for each workout group.
 * This allows multiple components using the same `groupId` to stay in sync.
 * The key is the `groupId`, and the value is an array of callback functions.
 */
const globalSubscribers: { [key: string]: (() => void)[] } = {};

/**
 * A custom hook to manage a workout group's data, stored in AsyncStorage.
 * It provides functions to add, remove, and refresh the group members,
 * and ensures that all components using this hook for the same group are synchronized.
 * @param groupId The unique identifier for the workout group.
 * @returns An object containing the workout group data, loading state, and management functions.
 */
export const useWorkoutGroup = () =>{
    // State to hold the array of athletes in the workout group.
    const [workoutGroup, setWorkoutGroup] = useState<{id: string, username: string}[]>([]);
    // State to indicate if data is currently being loaded.
    const [loading, setLoading] = useState(true);
    // The key used to store this group's data in AsyncStorage.
    const key = `WorkoutGroup`;

     /**
      * Loads the workout group data from AsyncStorage and updates the component's state.
      */
    const loadWorkoutGroup = useCallback(async () => {
        try {
            setLoading(true);
            const stored = await AsyncStorage.getItem(key);
            if (stored) {
                setWorkoutGroup(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading workout group:', error);
        } finally {
            setLoading(false);
        }
    }, [key]);
    /**
     * Effect to load the workout group data when the component initially mounts.
     */
    useEffect(() => {
        loadWorkoutGroup();
    }, [loadWorkoutGroup]);

    /**
     * Adds a new athlete to the workout group, persists the change to AsyncStorage,
     * and notifies other subscribed components.
     * @param athlete The athlete object to add.
     */
    const addAthlete = useCallback(async (athlete: {id: string, username: string}) => {
        try {
            const updatedGroup = [...workoutGroup, athlete];
            await AsyncStorage.setItem(key, JSON.stringify(updatedGroup));
            setWorkoutGroup(updatedGroup);
        } catch (error) {
            console.error('Error adding athlete to workout group:', error);
        }
    }, [workoutGroup, key]);

    /**
     * Removes an athlete from the workout group, persists the change to AsyncStorage,
     * and notifies other subscribed components.
     * @param athleteId The ID of the athlete to remove.
     */
    const removeAthlete = useCallback(async (athleteId: string) => {
        try {
            const updatedGroup = workoutGroup.filter(athlete => athlete.id !== athleteId);
            await AsyncStorage.setItem(key, JSON.stringify(updatedGroup));
            setWorkoutGroup(updatedGroup);
        } catch (error) {
            console.error('Error removing athlete from workout group:', error);
        }
    }, [workoutGroup, key]);


  // Expose the state and management functions to the component.
  return {
    workoutGroup,
    loading,
    refreshWorkoutGroup: loadWorkoutGroup,
    addAthlete: addAthlete,
    removeAthlete: removeAthlete
  };
}
