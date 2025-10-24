import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, useWindowDimensions  } from "react-native";
import TrackMeButton from "../common/components/display/TrackMeButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Calender from "../common/components/history/Calender";
import GraphService from "../services/GraphService";
import DateService from "../services/DateService";
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import * as d3 from 'd3'; 

const GRAPH_ASPECT_RATIO = 9 / 16;

const History = () => {
    // Current distance filter text input
    const [distanceInput, setDistanceInput] = useState<string>("");
    // Distance filters for available dates
    const [distanceFilters, setDistanceFilters] = useState<string[]>([]);

    const [workRestRatios, setWorkRestRatios] = useState<{date:string, workRestRatio:number}[]>([]);

    const [width, setWidth] = useState<number>(0);

    useEffect(()=>{
        const date = new Date();
        const fetchWorkRestRatios = async () => {
            const resp = await GraphService.getWorkRestRatio(DateService.formatDate(date));
            if (resp.ok) {
                const data = await resp.json();
                setWorkRestRatios(data);
            }
        };
        fetchWorkRestRatios();
    }, []);
    const renderGraph = () => {
        const height = width * GRAPH_ASPECT_RATIO;
        const padding = 20;
        const multiplier = 1.1;
        const max = Math.max(...workRestRatios.map(wr => wr.workRestRatio));

        const yScale = d3.scaleLinear()
            .domain([0, max*multiplier])
            .range([height, padding]);
        const xScale = d3.scaleLinear()
            .domain([0, workRestRatios.length - 1])
            .range([0, width]);

        const lineFn = d3.line<{date:string, workRestRatio:number}>()
            .x((_, i) => xScale(i))
            .y(d => yScale(d.workRestRatio));

        const areaFn = d3.area<{date:string, workRestRatio:number}>()
            .x((_, i) => xScale(i))
            .y0(height)
            .y1(d => yScale(d.workRestRatio));
        
        const svgLine = lineFn(workRestRatios) || undefined;
        const svgArea = areaFn(workRestRatios) || undefined;

        return(
            <View className="w-[80%] mx-auto mt-6 flex-row">
                <View className="justify-between mb-6">
                    <Text className="mr-2">{(workRestRatios[workRestRatios.length-1]?.workRestRatio * multiplier).toString().slice(0, 5)}</Text>
                    <Text className="ml-auto mr-2">0</Text>
                </View>
                <View className="w-[80%]">
                    <View 
                        onLayout={(event) => {
                            const { width: layoutWidth } = event.nativeEvent.layout;
                            setWidth(layoutWidth);
                        }}
                        className="border trackme-border-gray w-full"
                    >
                        <Svg height={height} width={width}>
                            <Defs>
                                <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor="#007AFF" stopOpacity="1" />
                                    <Stop offset="100%" stopColor="#007AFF" stopOpacity="0.1" />
                                </LinearGradient>
                            </Defs>
                            <Path d={svgLine || ""} stroke="#007AFF" fill="none" strokeWidth={3}/>
                            <Path d={svgArea || ""} fill="url(#gradient)" />
                        </Svg>
                    </View>
                    <View className="flex-row justify-between">
                        <Text>{workRestRatios[0]?.date}</Text>
                        <Text>{workRestRatios[workRestRatios.length-1]?.date}</Text>
                    </View>
                </View>
            </View>
        );
    };
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
                <Text className="text-lg font-semibold text-center mt-8">Work-Rest Ratio (Past 30 Sessions)</Text>
                {workRestRatios.length > 1 ? renderGraph() : <Text className="text-center my-4">Loading graph...</Text>}
            </View>
        </KeyboardAwareScrollView>
    );
}

export default History;