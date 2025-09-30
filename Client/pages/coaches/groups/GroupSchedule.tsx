import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import DateService from "../../../services/DateService";

const GroupSchedule = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());

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

    const sunday = DateService.getSunday(currentWeek);
    const saturday = DateService.getSaturday(sunday);

    return (
        <View className="flex-1 p-4">
            <View className="flex-row justify-between items-center mb-5 py-2.5">
                <TouchableOpacity onPress={navigateBack}>
                    <Text className="text-2xl px-2.5 text-blue-500">←</Text>
                </TouchableOpacity>
                
                <Text className="text-lg font-bold">
                    {sunday.toLocaleDateString()} - {saturday.toLocaleDateString()}
                </Text>
                
                <TouchableOpacity onPress={navigateForward}>
                    <Text className="text-2xl px-2.5 text-blue-500">→</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GroupSchedule;
