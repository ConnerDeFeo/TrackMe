import { useCallback, useEffect, useRef, useState } from "react";
import HistoryService from "../services/HistoryService";
import { View, PanResponder, Animated, Dimensions, Text, Pressable, Image, TextInput, ScrollView, FlatList } from "react-native";
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
    
    // Current month and year being viewed
    const [monthYear, setMonthYear] = useState<Date>(thisMonth);
    const currentMonthKey = monthYear.toISOString().slice(0,7);

    // Current distance filter text input
    const [distanceInput, setDistanceInput] = useState<string>("");
    // Distance filters for available dates
    const [distanceFilters, setDistanceFilters] = useState<string[]>([]);
    
    // Earliest date with historical data available (YYYY-MM format)
    const [earliestDate, setEarliestDate] = useState<string>(thisMonth.toISOString().slice(0,7));
    
    // Display name for current month (e.g., "January 2024")
    const [displayMonthName, setDisplayMonthName] = useState<string>(monthYear.toLocaleString('default', { month: 'long', year: 'numeric' }));
    
    // Cached available dates with historical data, keyed by month (YYYY-MM)
    const [availableDates, setAvailableDates] = useState<Record<string, Set<string>>>({});
    // Loading state for available dates fetch
    const [loading, setLoading] = useState<boolean>(false);
    
    
    const navigation = useNavigation<any>();

    // Animation value for swipe gesture (starts at -SCREEN_WIDTH for center position)
    const panX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    // Scroll enabled state for parent ScrollView
    const [verticalScrollEnabled, setScrollEnabled] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(1); // start on middle month
    const flatListRef = useRef(null);

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentIndex(index);
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
        panX.setValue(-SCREEN_WIDTH);
        if (!availableDates.hasOwnProperty(currentMonthKey) ) {
            fetchAvailableDates();
        }
    }, [monthYear]);


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

    // ========== Month Navigation ==========
    // Navigate to the next month
    const nextMonth = () => {
        setDisplayMonthName(DateService.addMonths(monthYear, 1).toLocaleString('default', { month: 'long', year: 'numeric' }));
        setMonthYear(DateService.addMonths(monthYear, 1));
    };

    // Navigate to the previous month
    const prevMonth = () => {
        setDisplayMonthName(DateService.addMonths(monthYear, -1).toLocaleString('default', { month: 'long', year: 'numeric' }));
        setMonthYear(DateService.addMonths(monthYear, -1));
    };

    // Navigate to detailed view for selected date
    const handleDateSelect = useCallback((date: string) => {
        navigation.navigate("HistoricalData", { date });
    }, [navigation]);

    // ========== Render ==========
    // Array of three months: previous, current, next (for swipe animation)
    const months: Date[] = [
        DateService.addMonths(monthYear, -1),
        monthYear,
        DateService.addMonths(monthYear, 1),
    ];

    return(
        <KeyboardAwareScrollView
            className='bg-white flex-1 pt-4' 
            showsHorizontalScrollIndicator={false} 
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled" 
            scrollEnabled={verticalScrollEnabled}
        >
            {/* Month header with navigation arrows */}
            <View className="flex-row justify-between m-4 items-center relative">
                {/* Previous month button (only show if not at earliest date) */}
                { earliestDate < monthYear.toISOString().slice(0,7) &&
                    <Pressable className="p-1 pr-3 absolute left-0" onPress={prevMonth}>
                        <Image source={require('../assets/images/Back.png')} className="w-6 h-6" />
                    </Pressable>
                }
                {/* Current month display */}
                <Text className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">{displayMonthName}</Text>
                {/* Next month button (only show if not at current month) */}
                {thisMonth > monthYear &&
                    <Pressable className="p-1 pl-3 absolute right-0" onPress={nextMonth}>
                        <Image source={require('../assets/images/Back.png')} className="w-6 h-6 rotate-180" />
                    </Pressable>
                }
            </View>
            
            {/* Swipeable month container */}
            <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={months}
                initialScrollIndex={1}
                getItemLayout={(_, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
                renderItem={({ item }) => (
                    <View style={{ width: SCREEN_WIDTH }}>
                        <RenderMonth
                            monthYear={item}
                            availableDates={availableDates[currentMonthKey]}
                            handleDateSelect={handleDateSelect}
                            className="m-4"
                            loading={loading}
                        />
                    </View>
                )}
                ref={flatListRef}
                keyExtractor={(item) => item.toISOString()}
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