import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import HistoryService from "../services/HistoryService";
import DisplayWorkout from "../common/components/display/workout/DisplayWorkout";
import InputDisplay from "../common/components/display/input/InputDisplay";
import Workout from "../common/types/workouts/Workout";

const HistoricalData = ()=>{
    const route = useRoute();
    const { date } = (route.params as { date: string }) || {};
    const [historicalData, setHistoricalData] = useState<Record<string, any>>({});

    // Fetch historical data for the given date when component mounts
    useEffect(() => {
        const fetchHistoricalData = async () => {
            const resp = await HistoryService.fetchHistoricalData(date);
            if (resp.ok) {
                const data = await resp.json();
                console.log(data)
                setHistoricalData(data);
            }
        };
        fetchHistoricalData();
    }, [date]);

    return(
        <>
            <View className="min-h-screen">
                
            </View>
        </>
    );
}

export default HistoricalData;