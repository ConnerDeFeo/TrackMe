import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "../services/AsyncStorage";
import UserService from "../services/UserService";

const globalSubscribers: { [key: string]: (() => void)[] } = {};

export const useWorkoutGroup = (groupId:string, ) =>{
    const [workoutGroup, setWorkoutGroup] = useState<{id: string, username: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    const key = `WorkoutGroup-${groupId}`;

    // Function to notify all subscribers for this group
    const notifySubscribers = useCallback(() => {
        if (globalSubscribers[groupId]) {
            globalSubscribers[groupId].forEach(callback => callback());
        }
    }, [groupId]);

     // Load data from AsyncStorage
    const loadWorkoutGroup = useCallback(async () => {
        try {
            setLoading(true);
            const stored = await AsyncStorage.getData(key);
        if (stored) {
            setWorkoutGroup(JSON.parse(stored));
        }
        else if (!hasInitialized) {
            const userId = await UserService.getUserId();
            const username = await UserService.getUsername();
            if(userId && username){
                const defaultGroup = [{ id: userId, username }];
                await AsyncStorage.storeData(key, JSON.stringify(defaultGroup));
                setWorkoutGroup(defaultGroup);
            }
            setHasInitialized(true);
        }
        } catch (error) {
            console.error('Error loading workout group:', error);
        } finally {
            setLoading(false);
        }
    }, [key]);

    // Subscribe this hook instance to updates
    useEffect(() => {
        if (!globalSubscribers[groupId]) {
            globalSubscribers[groupId] = [];
        }
        
        // Add this instance's refresh function as a subscriber
        globalSubscribers[groupId].push(loadWorkoutGroup);
        
        // Cleanup on unmount
        return () => {
            globalSubscribers[groupId] = globalSubscribers[groupId]?.filter(
                callback => callback !== loadWorkoutGroup
            ) || [];
        };
    }, [groupId, loadWorkoutGroup]);

    //load data on component mount
    useEffect(() => {
        loadWorkoutGroup();
    }, [loadWorkoutGroup]);

    const addAthlete = useCallback(async (athlete: {id: string, username: string}) => {
        try {
            const updatedGroup = [...workoutGroup, athlete];
            await AsyncStorage.storeData(key, JSON.stringify(updatedGroup));
            setWorkoutGroup(updatedGroup);
        } catch (error) {
            console.error('Error adding athlete to workout group:', error);
        }
        notifySubscribers();
    }, [workoutGroup, key]);

    const removeAthlete = useCallback(async (athleteId: string) => {
        try {
            const updatedGroup = workoutGroup.filter(athlete => athlete.id !== athleteId);
            await AsyncStorage.storeData(key, JSON.stringify(updatedGroup));
            setWorkoutGroup(updatedGroup);
        } catch (error) {
            console.error('Error removing athlete from workout group:', error);
        }
        notifySubscribers();
    }, [workoutGroup, key]);


  return {
    workoutGroup,
    loading,
    refreshWorkoutGroup: loadWorkoutGroup,
    addAthlete: addAthlete,
    removeAthlete: removeAthlete
  };
}
