import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import HistoryService from "../services/HistoryService";
import { Input } from "../common/types/inputs/Input";
import InputDisplay from "../common/components/display/input/InputDisplay";

const HistoricalData = ()=>{
    const route = useRoute();
    const { date } = (route.params as { date: string }) || {};
    const [historicalData, setHistoricalData] = useState<Record<string, {inputs:Input[], username:string}>>({});

    // Fetch historical data for the given date when component mounts
    useEffect(() => {
        const fetchHistoricalData = async () => {
            const resp = await HistoryService.fetchHistoricalData(date);
            if (resp.ok) {
                const data = await resp.json();
                setHistoricalData(data);
            }
        };
        fetchHistoricalData();
    }, [date]);

    return(
        <>
            <View className="min-h-screen">
                {Object.entries(historicalData).map(([userID, data]) => 
                    <View key={userID} className="bg-white p-4 rounded-xl shadow-sm border border-b border-gray-100">
                        <Text className="font-bold text-lg mb-2">{data.username}</Text>
                        {data.inputs.map((input, idx) => (
                            <InputDisplay key={idx} input={input} />
                        ))}
                    </View>
                )}
            </View>
        </>
    );
}

export default HistoricalData;