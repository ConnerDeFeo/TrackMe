import { useCallback, useEffect, useRef, useState } from "react";
import HistoryService from "../services/HistoryService";
import { View, Dimensions, Text, Pressable, Image, TextInput, FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DateService from "../services/DateService";
import RenderMonth from "../common/components/history/RenderMonth";
import TrackMeButton from "../common/components/display/TrackMeButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SCREEN_WIDTH = Dimensions.get("window").width; 

const History = () => {
    // ========== Date State Management ==========
    // Today's date, flag for not allowing user to go past today
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    // Current month index (0 = thisMonth, negative = past, positive would be future)
    const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0);
    
    // Current distance filter text input
    const [distanceInput, setDistanceInput] = useState<string>("");
    // Distance filters for available dates
    const [distanceFilters, setDistanceFilters] = useState<string[]>([]);
    
    // Earliest date with historical data available (YYYY-MM format)
    const [earliestDate, setEarliestDate] = useState<string>(thisMonth.toISOString().slice(0,7));
    
    // Cached available dates with historical data, keyed by month (YYYY-MM)
    const [availableDates, setAvailableDates] = useState<Record<string, Set<string>>>({});
    // Loading state for available dates fetch
    const [loading, setLoading] = useState<boolean>(false);
    
    const navigation = useNavigation<any>();
    const flatListRef = useRef<FlatList>(null);
    
    // Calculate months based on offset
    const currentMonth = DateService.addMonths(thisMonth, currentMonthOffset);
    const currentMonthKey = currentMonth.toISOString().slice(0,7);
    const displayMonthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const handleMomentumScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);

        if (index === 0 && earliestDate < currentMonthKey) {
            // Swiped to previous month
            setCurrentMonthOffset(prev => prev - 1);
            setTimeout(() => flatListRef.current?.scrollToIndex({ index: 1, animated: false }), 0);
        } else if (index === 2 && currentMonthOffset < 0) {
            // Swiped to next month
            setCurrentMonthOffset(prev => prev + 1);
            setTimeout(() => flatListRef.current?.scrollToIndex({ index: 1, animated: false }), 0);
        }
    };

    // ========== Data Fetching ==========
    // Fetch available dates for a specific month from the server
    const fetchAvailableDates = async () => {
        setLoading(true);
        const resp = await HistoryService.getAvailableHistoryDates(currentMonthKey, distanceFilters);
        if(resp.ok) {
            const data = await resp.json();
            setAvailableDates({...availableDates, [currentMonthKey]: new Set(data)});
        } else {
            setAvailableDates({...availableDates, [currentMonthKey]: new Set()});
        }
        setLoading(false);
    }

    // On screen focus, fetch available dates
    useFocusEffect(useCallback(() => {
        fetchAvailableDates();
    }, [distanceFilters]));

    // Reset animation position and fetch dates when month changes
    useEffect(() => {
        if (!availableDates.hasOwnProperty(currentMonthKey) ) {
            fetchAvailableDates();
        }
    }, [currentMonth]);


    // Fetch the earliest date with available data on component mount
    useEffect(() => {
        const fetchEarliestDate = async () => {
            const resp = await HistoryService.getEarliestDateAvailable();
            if (resp.ok) {
                const earliestDate = await resp.json();
                setEarliestDate(earliestDate.slice(0,7));
            }
        };
        fetchEarliestDate();
    }, []);


    // Navigate to detailed view for selected date
    const handleDateSelect = useCallback((date: string) => {
        navigation.navigate("HistoricalData", { date });
    }, [navigation]);

    return(
        <KeyboardAwareScrollView
            className='bg-white flex-1 pt-4' 
            showsHorizontalScrollIndicator={false} 
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
        >
            {/* Month header with navigation arrows */}
            <View className="flex-row justify-between m-4 items-center relative">
                {/* Previous month button (only show if not at earliest date) */}
                { earliestDate < currentMonthKey &&
                    <Pressable className="p-1 pr-3 absolute left-0" onPress={() => setCurrentMonthOffset(prev => prev - 1)}>
                        <Image source={require('../assets/images/Back.png')} className="w-6 h-6" />
                    </Pressable>
                }
                {/* Current month display */}
                <Text className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">{displayMonthName}</Text>
                {/* Next month button (only show if not at current month) */}
                {currentMonthOffset < 0 &&
                    <Pressable className="p-1 pl-3 absolute right-0" onPress={() => setCurrentMonthOffset(prev => prev + 1)}>
                        <Image source={require('../assets/images/Back.png')} className="w-6 h-6 rotate-180" />
                    </Pressable>
                }
            </View>
            
            {/* Swipeable month container */}
            <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={[-1, 0, 1]}
                initialScrollIndex={1}
                getItemLayout={(_, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
                renderItem={({ item }) => {
                    const monthToRender = DateService.addMonths(currentMonth, item);
                    const monthKey = monthToRender.toISOString().slice(0,7);
                    
                    return (
                        <View style={{ width: SCREEN_WIDTH }}>
                            <RenderMonth
                                monthYear={monthToRender}
                                availableDates={availableDates[monthKey]}
                                handleDateSelect={handleDateSelect}
                                className="m-4"
                                loading={loading && item === 0}
                            />
                        </View>
                    );
                }}
                ref={flatListRef}
                keyExtractor={(item) => `month-offset-${item}`}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEnabled={true}
            />
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