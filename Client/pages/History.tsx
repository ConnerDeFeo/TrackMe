import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import TrackMeButton from "../common/components/display/TrackMeButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Calender from "../common/components/history/Calender";


const History = () => {

    // Current distance filter text input
    const [distanceInput, setDistanceInput] = useState<string>("");
    // Distance filters for available dates
    const [distanceFilters, setDistanceFilters] = useState<string[]>([]);
    
    return(
        <KeyboardAwareScrollView
            className='bg-white flex-1 pt-4' 
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
        </KeyboardAwareScrollView>
    );
}

export default History;