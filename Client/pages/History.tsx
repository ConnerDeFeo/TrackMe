import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import TrackMeButton from "../common/components/display/TrackMeButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Calender from "../common/components/history/Calender";
import GraphService from "../services/GraphService";
import DateService from "../services/DateService";
import Svg, { Circle, Path } from 'react-native-svg';
import * as d3 from 'd3';

const GRAPH_ASPECT_RATIO = 9 / 16;

const History = () => {

    // Current distance filter text input
    const [distanceInput, setDistanceInput] = useState<string>("");
    // Distance filters for available dates
    const [distanceFilters, setDistanceFilters] = useState<string[]>([]);

    // const [workRestRatios, setWorkRestRatios] = useState<{date:string, ratio:number}[]>([]);

    // useEffect(()=>{
    //     const date = new Date();
    //     const fetchWorkRestRatios = async () => {
    //         const resp = await GraphService.getWorkRestRatio(DateService.formatDate(date));
    //         if (resp.ok) {
    //             const data = await resp.json();
    //             setWorkRestRatios(data);
    //         }
    //     };
    //     fetchWorkRestRatios();
    // }, []);
    const workRestRatios = [{date: "2023-01-01", ratio: 0.5}, {date: "2023-01-02", ratio: 0.7}, {date: "2023-01-03", ratio: 0.6}];
    // Graph stuff
    const width = 350;
    const height = width * GRAPH_ASPECT_RATIO;

    const min = Math.min(...workRestRatios.map(wr => wr.ratio));
    const max = Math.max(...workRestRatios.map(wr => wr.ratio));

    const yScale = d3.scaleLinear()
        .domain([min, max])
        .range([height, 0]);
    const xScale = d3.scaleLinear()
        .domain([0, workRestRatios.length - 1])
        .range([0, width]);

    const lineFn = d3.line<{date:string, ratio:number}>()
        .x((d, i) => xScale(i))
        .y(d => yScale(d.ratio))
    
    const svgLine = lineFn(workRestRatios) || undefined;
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
            <View style={{ padding: 20 }}>
                <Svg height="100" width="100">
                    <Circle cx="50" cy="50" r="40" stroke="blue" strokeWidth="2.5" fill="green" />
                </Svg>
            </View>
        </KeyboardAwareScrollView>
    );
}

export default History;