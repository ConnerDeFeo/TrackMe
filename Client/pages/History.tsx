import { useCallback, useEffect, useState, useRef } from "react";
import HistoryService from "../services/HistoryService";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateService from "../services/DateService";
import { Variables } from "../common/constants/Variables";
import RenderDay from "../common/components/history/RenderDay";


const History = () => {
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    // Current month and year being viewed
    const [monthYear, setMonthYear] = useState<Date>(new Date());
    const navigation = useNavigation<any>();

    const nextMonth = useCallback(() => {
        setMonthYear(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, prev.getDate()));
    }, []);

    const prevMonth = useCallback(() => {
        setMonthYear(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, prev.getDate()));
    }, []);


    const fetchAvailableDates = async (date?:string) => {
            const resp = await HistoryService.getAvailableHistoryDates(date);
            if(resp.ok) {
                const data = await resp.json();
                console.log("Available dates:", data);  
                setAvailableDates(new Set(data));
            } else {
                setAvailableDates(new Set());
            }
        }

    useEffect(() => {
        fetchAvailableDates();  
    },[]);

    const handleDateSelect = useCallback((date: string) => {
        navigation.navigate("HistoricalData", { date });
    }, [navigation]);

    return(
        <View 
            className="m-4"
        >
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
                <View className="flex-row flex-wrap">
                    {DateService.getDaysInMonth(monthYear).map((day, index) => {
                        const dateStr = `${DateService.formatDate(monthYear).slice(0,7)}-${day}`;
                        return (
                            <RenderDay
                                key={index}
                                day={day}
                                available={day ? availableDates.has(dateStr) : false}
                                onPress={day ? () => handleDateSelect(dateStr) : undefined}
                            />
                        );
                    })}
                </View>
            </View>
        </View>
);
}

export default History;