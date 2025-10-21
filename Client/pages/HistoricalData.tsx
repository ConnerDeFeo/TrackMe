import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import HistoryService from "../services/HistoryService";
import { Input } from "../common/types/inputs/Input";
import InputDisplay from "../common/components/display/input/InputDisplay";
import TrackMeButton from "../common/components/display/TrackMeButton";

const HistoricalData = ()=>{
    const route = useRoute();
    const { date } = (route.params as { date: string }) || {};
    const [historicalData, setHistoricalData] = useState<Record<string, {inputs:Input[], username:string}>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<any>();

    // Fetch historical data for the given date when component mounts
    useFocusEffect(useCallback(() => {
        const fetchHistoricalData = async () => {
            setLoading(true);
            const resp = await HistoryService.fetchHistoricalData(date);
            if (resp.ok) {
                const data = await resp.json();
                setHistoricalData(data);
            }
            setLoading(false);
        };
        fetchHistoricalData();
    }, [date]));

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#007AFF" className="m-10"/>
        );
    }

    return(
        <View className="flex-1">
            {Object.keys(historicalData).length > 0 ?
                Object.entries(historicalData).map(([userID, data]) => 
                    <View key={userID} className="bg-white p-4 rounded-xl shadow-sm border border-b border-gray-100">
                        <Text className="font-bold text-lg mb-2">{data.username}</Text>
                        {data.inputs.map((input, idx) => (
                            <InputDisplay key={idx} input={input} />
                        ))}
                    </View>
                )
                :
                <Text className="text-center text-gray-500 mt-6 pt-2">No historical data for this date.</Text>
            }
            <TrackMeButton text="Update My Inputs" className="m-4" onPress={() => navigation.navigate('HistoricalInputs', {date})} />
        </View>
    );
}

export default HistoricalData;