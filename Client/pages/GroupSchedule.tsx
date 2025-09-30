import { Pressable, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import DateService from "../services/DateService";
import ArrowButton from "../components/ArrowButton";
import Workout from "../types/Workout";
import GeneralService from "../services/GeneralService";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import DisplayWorkout from "../components/display/DisplayWorkout";
import { AccountType } from "../assets/constants/Enums";
import { AuthContext } from "../context/AuthContext";

const GroupSchedule = () => {
    // Get groupId and groupName from route params
    const route = useRoute();
    const { groupId, groupName } = route.params as { groupId: string; groupName: string };
    // State to hold the start of the current week
    const [currentWeek, setCurrentWeek] = useState(new Date());
    // State to hold workouts mapped by date string
    const [workouts, setWorkouts] = useState<Record<string, Workout[]>>({});
    const authContext = useContext(AuthContext);
    const accountType = authContext[0];
    
    // Compute the Sunday and Saturday of the current week
    const sunday = DateService.getSunday(currentWeek);
    const saturday = DateService.getSaturday(sunday);
    
    // Navigation and focus hooks
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();

    // Fetch the weekly schedule for the group
    const fetchWorkouts = async () => {
        const resp = await GeneralService.getWeeklyGroupSchedule(
            groupId,
            DateService.formatDate(currentWeek)
        );
        if (resp.ok) {
            const data = await resp.json();
            setWorkouts(data);       // Update workouts state
        } else {
            setWorkouts({});         // Clear on error
        }
    };

    // Re-fetch workouts when the week, group, or focus changes
    useEffect(() => {
        if (isFocused) {
            fetchWorkouts();
        }
    }, [currentWeek, groupId, isFocused]);

    // Navigate one week back
    const navigateBack = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeek(newDate);
    };

    // Navigate one week forward
    const navigateForward = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeek(newDate);
    };

    return (
        <View className="flex-1 p-4">
            {/* Header: week navigation */}
            <View className="flex-row justify-between items-center mb-5 py-2.5">
                <ArrowButton onPress={navigateBack} direction="left" />
                <Text className="text-lg font-bold">
                    {sunday.toLocaleDateString()} - {saturday.toLocaleDateString()}
                </Text>
                <ArrowButton onPress={navigateForward} direction="right" />
            </View>

            {/* List each day of the week */}
            <View>
                {Array.from({ length: 7 }, (_, i) => {
                    // Compute the date for this index
                    const day = new Date(sunday);
                    day.setDate(sunday.getDate() + i);
                    const dateKey = DateService.formatDate(day);

                    // Get workouts for this day
                    const dayWorkouts = workouts[dateKey] || [];

                    return (
                        <View
                            key={i}
                            className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                        >
                            {/* Day header with add workout button */}
                            <View className="flex flex-row justify-between items-center border-b border-gray-200 pb-2 mb-2">
                                <Text className="text-lg font-semibold text-gray-800">
                                    {day.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </Text>
                                {accountType === AccountType.Coach && (
                                    <Pressable
                                        onPress={() =>
                                            navigation.navigate('AssignWorkout', {
                                                groupId,
                                                groupName,
                                                date: dateKey,
                                            })
                                        }
                                    >
                                        <Text className="trackme-blue">Add Workout</Text>
                                    </Pressable>
                                )}
                            </View>

                            {/* Workout list or placeholder */}
                            {dayWorkouts.length > 0 ? (
                                <View className="space-y-2">
                                    {dayWorkouts.map((workout, idx) => (
                                        <DisplayWorkout key={idx} workout={workout} />
                                    ))}
                                </View>
                            ) : (
                                <Text className="text-gray-500 italic text-center py-4">
                                    No workouts scheduled
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default GroupSchedule;
