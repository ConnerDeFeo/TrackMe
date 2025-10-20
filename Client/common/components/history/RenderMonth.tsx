import { ActivityIndicator, Text, View } from "react-native";
import DateService from "../../../services/DateService";
import RenderDay from "./RenderDay";
import { Variables } from "../../constants/Variables";

const RenderMonth = ({ monthYear, handleDateSelect, availableDates, className, loading}: 
    { 
        monthYear: Date; 
        handleDateSelect: (date: string) => void;
        availableDates?: Set<string>; 
        className?: string;
        loading?: boolean;
    }
) => {
    return (
        <View className={`relative ${className}`}>
            {/* Days of week header */}
            <View className="flex-row mb-2">
                {Variables.daysOfWeek.map((day, index) => (
                    <View key={index} className="flex-1 items-center">
                        <Text className="font-bold">{day}</Text>
                    </View>
                ))}
            </View>
            
            {/* Calendar grid */}
            <View  className="flex-row flex-wrap">
                {DateService.getDaysInMonth(monthYear).map((day, index) => {
                    if(!day) {
                        return <View key={index} className="w-[14.28%] p-1" />;
                    }
                    const dateStr = `${DateService.formatDate(monthYear).slice(0,7)}-${day < 10 ? `0${day}` : day}`;
                    return (
                        <RenderDay
                            key={index}
                            day={day}
                            available={availableDates?.has(dateStr) ?? false}
                            onPress={() => handleDateSelect(dateStr)}
                        />
                    );
                })}
            </View>
            {loading && 
                <View className="absolute h-full w-full bg-white opacity-30 top-0 left-0 flex justify-center items-center">
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            }
        </View>
    );
}

export default RenderMonth;