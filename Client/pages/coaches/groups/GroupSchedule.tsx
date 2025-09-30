import { Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import DateService from "../../../services/DateService";
import ArrowButton from "../../../components/ArrowButton";
import Workout from "../../../types/Workout";
import GeneralService from "../../../services/GeneralService";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import DisplayWorkout from "../../../components/display/DisplayWorkout";

const GroupSchedule = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [workouts, setWorkouts] = useState<Record<string, Workout[]>>({});
    const sunday = DateService.getSunday(currentWeek);
    const saturday = DateService.getSaturday(sunday);
    const route = useRoute();
    const { groupId, groupName } = route.params as { groupId: string; groupName: string };
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();

    // Fetch workouts for the current week
    const fetchWorkouts = async () => {
        const resp = await GeneralService.getWeeklyGroupSchedule(groupId, DateService.formatDate(currentWeek));
        if (resp.ok) {
            const data = await resp.json();
            setWorkouts(data);
        } else {
            setWorkouts({});
        }
    }
        

    useEffect(() => {
        if (isFocused) {
            fetchWorkouts();
        }
    }, [currentWeek, groupId, isFocused]);

    const navigateBack = () => {
        // Logic to navigate back, e.g., using navigation.goBack() if using React Navigation
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeek(newDate);
    }

    const navigateForward = () => {
        // Logic to navigate forward, e.g., using navigation.goBack() if using React Navigation
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeek(newDate);
    }

    return (
        <View className="flex-1 p-4">
            <View className="flex-row justify-between items-center mb-5 py-2.5">
                <ArrowButton onPress={navigateBack} direction="left" />
                
                <Text className="text-lg font-bold">
                    {sunday.toLocaleDateString()} - {saturday.toLocaleDateString()}
                </Text>
                
                <ArrowButton onPress={navigateForward} direction="right" />
            </View>
            <View>
                {
                    Array.from({ length: 7 }, (_, i) => {
                        const day = new Date(sunday);
                        day.setDate(sunday.getDate() + i);
                        const dateKey = DateService.formatDate(day);
                        const dayWorkouts = workouts[dateKey] || [];
                        return (
                            <View key={i} className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                <View className="flex flex-row justify-between items-center border-b border-gray-200 pb-2 mb-2">
                                    <Text className="text-lg font-semibold text-gray-800">
                                        {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </Text>
                                    <Pressable onPress={() => navigation.navigate('AssignWorkout', { groupId, groupName, date: dateKey })}>
                                        <Text className="trackme-blue">Add Workout</Text>
                                    </Pressable>
                                </View>
                                {dayWorkouts.length > 0 ? (
                                    <View className="space-y-2">
                                        {dayWorkouts.map((workout, idx) => (
                                            <DisplayWorkout key={idx} workout={workout} />
                                        ))}
                                    </View>
                                ) : (
                                    <Text className="text-gray-500 italic text-center py-4">No workouts scheduled</Text>
                                )}
                            </View>
                        );
                    })
                }
            </View>
        </View>
    );
};

export default GroupSchedule;
