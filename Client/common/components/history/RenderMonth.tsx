import { Text, View } from "react-native";
import DateService from "../../../services/DateService";
import RenderDay from "./RenderDay";
import { Variables } from "../../constants/Variables";

const RenderMonth = ({ monthYear, handleDateSelect, availableDates, }: 
    { 
        monthYear: Date; 
        handleDateSelect: (date: string) => void;
        availableDates?: Set<string>; 
    }
) => {
    return (
        <View className="mx-4">
            <Text className="text-2xl font-bold mb-4">{monthYear.toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
            <View>
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
                        const dateStr = `${DateService.formatDate(monthYear).slice(0,7)}-${day}`;
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
            </View>
        </View>
    );
}

export default RenderMonth;