import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import HistoryService from "../../services/HistoryService";
import UserService from "../../services/UserService";
import DisplayWorkout from "../../components/DisplayWorkout";
import PageHeading from "../../components/PageHeading";

const HistoricalData = ()=>{
    const route = useRoute();
    const { date } = (route.params as { date: string }) || {};
    const [historicalData, setHistoricalData] = useState<Record<string, any>>({});

    // Fetch historical data for the given date when component mounts
    useEffect(() => {
        const fetchHistoricalData = async () => {
            const coachId = await UserService.getUserId();
            const resp = await HistoryService.fetchHistoricalData(coachId!, date);
            if (resp.ok) {
                const data = await resp.json();
                setHistoricalData(data);
            }
        };
        fetchHistoricalData();
    }, [date]);

    return(
        <>
            <PageHeading title={date} goBack/>
            <View className="min-h-screen">
                {Object.keys(historicalData).length === 0 ? (
                <Text className="text-center mt-10">No historical data available for this date.</Text>
                ) : 
                (Object.keys(historicalData).map((groupId) => (
                    <View key={groupId} className="bg-white border-2 border-gray-200 shadow-md p-5 mb-6">
                        <Text className="text-3xl font-bold text-gray-900 mb-4">{historicalData[groupId].name}</Text>
                        
                        <View className="mb-4">
                            <Text className="text-lg font-semibold mb-3 text-red-500">Workouts</Text>
                            {historicalData[groupId].workouts.map((workout: Record<string, any>, idx: number) =>
                            <DisplayWorkout
                                workout={workout}
                                key={idx}
                            />
                            )}
                        </View>

                        <View className="border-t border-gray-200 pt-4">
                            <Text className="text-lg font-semibold mb-3 text-red-500">Athlete Inputs</Text>
                            {Object.keys(historicalData[groupId].athleteInputs).map((athleteId) => {
                            const athleteData = historicalData[groupId].athleteInputs[athleteId];
                            return (
                                <View key={athleteId} className="mb-4">
                                    <Text className="text-md font-bold mb-2">{athleteData.username}</Text>
                                    <View className="space-y-2">
                                        {athleteData.inputs.map((input: Record<string, any>, index: number) => (
                                        <View key={index} className="bg-gray-100 rounded-lg p-3 flex-row justify-between items-center">
                                            <Text className="text-gray-800 font-medium">Distance: {input.distance}m</Text>
                                            <Text className="text-gray-600">Time: {input.time}s</Text>
                                        </View>
                                        ))}
                                    </View>
                                </View>
                            );
                            })}
                        </View>
                    </View>
                ))
                )}
            </View>
        </>
    );
}

export default HistoricalData;