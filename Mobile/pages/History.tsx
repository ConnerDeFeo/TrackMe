import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, ActivityIndicator  } from "react-native";
import TrackMeButton from "../common/components/display/TrackMeButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Calender from "../common/components/history/Calender";
import GraphService from "../services/GraphService";
import DateService from "../services/DateService";
import Graph from "../common/components/Graph";

const History = () => {
    // Current distance filter text input
    const [distanceInput, setDistanceInput] = useState<string>("");
    // Distance filters for available dates
    const [distanceFilters, setDistanceFilters] = useState<string[]>([]);

    const [workRestRatios, setWorkRestRatios] = useState<{date:string, workRestRatio:number}[]>([]);
    const [avgVelocities, setAvgVelocities] = useState<{date:string, avgVelocity:number}[]>([]);

    useEffect(()=>{
        const date = new Date();
        const fetchWorkRestRatios = async () => {
            const resp = await GraphService.getWorkRestRatio(DateService.formatDate(date));
            if (resp.ok) {
                const data = await resp.json();
                setWorkRestRatios(data);
            }
        };
        const fetchAvgVelocities = async () => {
            const resp = await GraphService.getAvgVelocity(DateService.formatDate(date));
            if (resp.ok) {
                const data = await resp.json();
                setAvgVelocities(data);
            }
        };
        fetchWorkRestRatios();
        fetchAvgVelocities();
    }, []);

    return(
        <KeyboardAwareScrollView
            className='bg-white flex-1 pt-4 ' 
            showsHorizontalScrollIndicator={false} 
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        >
            <Calender distanceFilters={distanceFilters} />
            <View className="mx-4 mt-6">
                <Text className="text-lg font-semibold mb-3">Search Distances</Text>
                <View className="flex-row gap-2 mb-3 items-center">
                    <TextInput 
                        placeholder="Enter distance (meters)" 
                        keyboardType="numeric"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm"
                        value={distanceInput}
                        onChangeText={setDistanceInput}
                    />
                    <TrackMeButton 
                        text="Add" 
                        onPress={() => {
                            if (distanceInput.trim() && !distanceFilters.includes(distanceInput.trim())) {
                                setDistanceFilters([...distanceFilters, distanceInput.trim()]);
                                setDistanceInput("");
                            }
                        }}
                    />
                </View>
                
                {distanceFilters.length > 0 && (
                    <View className="mb-2 mx-4">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-sm font-medium text-gray-600">
                                Active Filters ({distanceFilters.length})
                            </Text>
                            <Pressable onPress={() => setDistanceFilters([])}>
                                <Text className="text-red-600 font-medium py-2 pr-2 pl-4 trackme-red">Clear All</Text>
                            </Pressable>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {distanceFilters.map((filter, index) => (
                                <Pressable
                                    key={index} 
                                    className="flex-row items-center bg-blue-100 rounded-full px-4 py-2 shadow-sm gap-x-2"
                                    onPress={()=>setDistanceFilters(prev => prev.filter(dst => dst!==filter))}
                                >
                                    <Text className="text-blue-800 font-medium mr-2">{filter}m</Text>
                                    <Text className="trackme-red">X</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}
            </View>
            <View className="mb-12">
                <View>
                    <Text className="text-lg font-semibold text-center mt-8">Work-Rest Ratio (Past 30 Sessions)</Text>
                    {workRestRatios.length > 1 ? 
                        <Graph 
                            data={workRestRatios.map(item => item.workRestRatio)} 
                            className="w-[80%] mx-auto mt-6 flex-row"
                            xStart={workRestRatios[0]?.date}
                            xEnd={workRestRatios[workRestRatios.length - 1]?.date}
                        /> 
                        : 
                        <ActivityIndicator className="mt-6" size="large" color="#007AFF" />
                    }
                </View>
                <View>
                    <Text className="text-lg font-semibold text-center mt-8">Average Velocity (Past 30 Sessions, m/s)</Text>
                    {avgVelocities.length > 1 ? 
                        <Graph 
                            data={avgVelocities.map(item => item.avgVelocity)} 
                            className="w-[80%] mx-auto mt-6 flex-row"
                            xStart={avgVelocities[0]?.date}
                            xEnd={avgVelocities[avgVelocities.length - 1]?.date}
                        /> 
                        : 
                        <ActivityIndicator className="mt-6" size="large" color="#007AFF" />
                    }
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

export default History;