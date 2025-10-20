import { useCallback, useEffect, useRef, useState } from "react";
import HistoryService from "../services/HistoryService";
import { View, PanResponder, Animated, Dimensions, Text, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateService from "../services/DateService";
import RenderMonth from "../common/components/history/RenderMonth";

const SCREEN_WIDTH = Dimensions.get("window").width; 

const History = () => {
    // ========== Date State Management ==========
    // Today's date, flag for not allowing user to go past today
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    // Current month and year being viewed
    const [monthYear, setMonthYear] = useState<Date>(thisMonth);
    
    // Earliest date with historical data available (YYYY-MM format)
    const [earliestDate, setEarliestDate] = useState<string>(thisMonth.toISOString().slice(0,7));
    
    // Display name for current month (e.g., "January 2024")
    const [displayMonthName, setDisplayMonthName] = useState<string>(monthYear.toLocaleString('default', { month: 'long', year: 'numeric' }));
    
    // Cached available dates with historical data, keyed by month (YYYY-MM)
    const [availableDates, setAvailableDates] = useState<Record<string, Set<string>>>({});
    const currentMonthKey = monthYear.toISOString().slice(0,7);
    
    // ========== Animation State ==========
    // Prevents user interaction during animation
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    
    const navigation = useNavigation<any>();

    // Animation value for swipe gesture (starts at -SCREEN_WIDTH for center position)
    const panX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    const requiredSwipeDistance = 150; // Minimum pixels to trigger month change

    // ========== Data Fetching ==========
    // Fetch available dates for a specific month from the server
    const fetchAvailableDates = async (date?:string) => {
        const resp = await HistoryService.getAvailableHistoryDates(date);
        if(resp.ok) {
            const data = await resp.json();
            setAvailableDates({...availableDates, [date || ""]: new Set(data)});
        } else {
            setAvailableDates({...availableDates, [date || ""]: new Set()});
        }
    }

    // Reset animation position and fetch dates when month changes
    useEffect(() => {
        panX.setValue(-SCREEN_WIDTH);
        if (!availableDates.hasOwnProperty(currentMonthKey)) {
            fetchAvailableDates(currentMonthKey);
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
        // Only allow gesture when not animating
        onMoveShouldSetPanResponder: () => {
            return !isAnimating;
        },
        // Update animation position as user swipes
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
        }
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
        <View className="mt-4">
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
                        />
                    </View>
                )}
            </Animated.View>
        </View>
    );
}

export default History;