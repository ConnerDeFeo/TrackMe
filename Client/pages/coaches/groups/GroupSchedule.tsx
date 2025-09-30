import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import DateService from "../../../services/DateService";
import ArrowButton from "../../../components/ArrowButton";
import Workout from "../../../types/Workout";
import GeneralService from "../../../services/GeneralService";
import { useRoute } from "@react-navigation/native";
import DisplayWorkout from "../../../components/display/DisplayWorkout";

const GroupSchedule = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [workouts, setWorkouts] = useState<Record<string, Workout[]>>({});
    const sunday = DateService.getSunday(currentWeek);
    const saturday = DateService.getSaturday(sunday);
    const route = useRoute();
    const { groupId } = route.params as { groupId: string };

    useEffect(() => {
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
        fetchWorkouts();
    }, [currentWeek]);

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
                                <Text className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                                    {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </Text>
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
