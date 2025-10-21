import { useCallback, useEffect, useRef, useState } from "react";
import HistoryService from "../services/HistoryService";
import { View, PanResponder, Animated, Dimensions, Text, Pressable, Image, TextInput, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DateService from "../services/DateService";
import RenderMonth from "../common/components/history/RenderMonth";
import TrackMeButton from "../common/components/display/TrackMeButton";
import TextButton from "../common/components/display/TextButton";

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
    // flag for component mounting to prevent double fetch
    const [isMounted, setIsMounted] = useState<boolean>(false);
    
    // Prevents user interaction during animation
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    
    const navigation = useNavigation<any>();

    // Animation value for swipe gesture (starts at -SCREEN_WIDTH for center position)
    const panX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    const requiredSwipeDistance = SCREEN_WIDTH * 0.25; // Minimum pixels to trigger month change
    // Scroll enabled state for parent ScrollView
    const [scrollEnabled, setScrollEnabled] = useState(true);

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
        const fetchAvailableDatesOnFocus = async () => {
            await fetchAvailableDates();
            setIsMounted(true);
        };
        fetchAvailableDatesOnFocus();
    }, []));

    // On Filter change, clear cached dates and refetch for current month
    useEffect(() => {
        if(isMounted){
            setAvailableDates({});
            fetchAvailableDates();
        }
    }, [distanceFilters]);

    // Reset animation position and fetch dates when month changes
    useEffect(() => {
        panX.setValue(-SCREEN_WIDTH);
        if (!availableDates.hasOwnProperty(currentMonthKey) && isMounted) {
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

    // ========== Swipe Gesture Handling ==========
    const panResponder = PanResponder.create({
        // Claim responder early for horizontal swipes
        onStartShouldSetPanResponder: (_, gesture) => {
            return Math.abs(gesture.dx) > Math.abs(gesture.dy);
        },
        onMoveShouldSetPanResponder: (_, gesture) => {
            const isHorizontal = Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5;
            if (isHorizontal && !isAnimating) {
                setScrollEnabled(false);
                return true;
            }
            return false;
        },
        onPanResponderMove: (_, gesture) => {
            panX.setValue(gesture.dx - SCREEN_WIDTH);
        },
        // Handle gesture completion
        onPanResponderRelease: (_, gesture) => {
            // Swipe right - go to previous month (if not at earliest date)
            if (gesture.dx > requiredSwipeDistance && monthYear.toISOString().slice(0,7) > earliestDate.slice(0,7)) {
                setDisplayMonthName(DateService.addMonths(monthYear, -1).toLocaleString('default', { month: 'long', year: 'numeric' }));
                setIsAnimating(true);
                Animated.spring(panX, { 
                    toValue: 7, 
                    useNativeDriver: true 
                }).start(() => {
                    prevMonth();
                    setIsAnimating(false);
                });
            } 
            // Swipe left - go to next month (if not at current month)
            else if (gesture.dx < -requiredSwipeDistance && monthYear < thisMonth) {
                setDisplayMonthName(DateService.addMonths(monthYear, 1).toLocaleString('default', { month: 'long', year: 'numeric' }));
                setIsAnimating(true);
                Animated.spring(panX, { 
                    toValue: (-SCREEN_WIDTH-3.5) * 2, 
                    useNativeDriver: true 
                }).start(() => {
                    nextMonth();
                    setIsAnimating(false);
                });
            } 
            // Snap back to center if swipe distance insufficient
            else {
                Animated.spring(panX, { 
                    toValue: -SCREEN_WIDTH, 
                    useNativeDriver: true 
                }).start();
            }
        },
        onPanResponderTerminate: () => {
            setScrollEnabled(true);
        },
    });

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
        <ScrollView className="pt-4 bg-white flex-1" scrollEnabled={scrollEnabled}>
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
            <Animated.View 
                style={{ transform: [{ translateX: panX }], width: SCREEN_WIDTH*3 }} // Three times screen width for swipe
                {...panResponder.panHandlers} 
                className="flex-row gap-x-2 mx-auto justify-center"
            >
                {/* Render three months side-by-side */}
                {months.map((month, index) => 
                    <View key={index} style={{ width: SCREEN_WIDTH }}>
                        <RenderMonth
                            monthYear={month}
                            availableDates={availableDates[currentMonthKey]}
                            handleDateSelect={handleDateSelect}
                            className="m-4"
                            loading={loading}
                        />
                    </View>
                )}
            </Animated.View>
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
        </ScrollView>
    );
}

export default History;