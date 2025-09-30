import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";

const GroupSchedule = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());

    // Get the Sunday of the current week
    const getSunday = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    // Get the Saturday of the current week
    const getSaturday = (sunday: Date) => {
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        return saturday;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            month: 'numeric', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeek(newDate);
    };

    const sunday = getSunday(currentWeek);
    const saturday = getSaturday(sunday);

    return (
        <View className="flex-1 p-4">
            <View className="flex-row justify-between items-center mb-5 py-2.5">
                <TouchableOpacity onPress={() => navigateWeek('prev')}>
                    <Text className="text-2xl px-2.5 text-blue-500">←</Text>
                </TouchableOpacity>
                
                <Text className="text-lg font-bold">
                    {formatDate(sunday)} - {formatDate(saturday)}
                </Text>
                
                <TouchableOpacity onPress={() => navigateWeek('next')}>
                    <Text className="text-2xl px-2.5 text-blue-500">→</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GroupSchedule;
