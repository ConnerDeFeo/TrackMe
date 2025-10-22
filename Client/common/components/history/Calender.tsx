import { useCallback, useEffect, useRef, useState } from "react";
import { View, Dimensions, Text, Pressable, Image, FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import HistoryService from "../../../services/HistoryService";
import DateService from "../../../services/DateService";
import RenderMonth from "./RenderMonth";

const SCREEN_WIDTH = Dimensions.get("window").width; 

const Calender = ({distanceFilters}:{distanceFilters?: string[]}) => {
    // ========== Date State Management ==========
    // Today's date, flag for not allowing user to go past today
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    // Current month and year being viewed
    const [months, setMonths] = useState<Date[]>([thisMonth]);
    const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);
    const currentMonthKey = months[currentMonthIndex].toISOString().slice(0,7);
    
    // Earliest date with historical data available (YYYY-MM format)
    const [earliestDate, setEarliestDate] = useState<string>(thisMonth.toISOString().slice(0,7));
    const earliestMonth = earliestDate.slice(0,7);
    
    // Display name for current month (e.g., "January 2024")
    const displayMonthName = months[currentMonthIndex].toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Cached available dates with historical data, keyed by month (YYYY-MM)
    const [availableDates, setAvailableDates] = useState<Record<string, Set<string>>>({});
    // Loading state for available dates fetch
    const [loading, setLoading] = useState<boolean>(false);
    
    const navigation = useNavigation<any>();

    // Animation value for swipe gesture (starts at -SCREEN_WIDTH for center position)
    const flatListRef = useRef<FlatList>(null);

    const appendMonth = () => {
        setMonths(prev => [ ...prev, DateService.addMonths(prev[prev.length -1], -1)]);
    }

    const handleMomentumScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);

        // If user scrolled to the last month (furthest back in time), add another month
        if (index === months.length - 1 && earliestMonth < months[index].toISOString().slice(0,7)) {
            appendMonth();
        }
        
        setCurrentMonthIndex(index);
    };

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
        if (availableDates.hasOwnProperty(currentMonthKey)) return;
        fetchAvailableDates();
    }, [distanceFilters, currentMonthKey]));
    
    // Fetch the earliest date with available data on component mount
    useEffect(() => {
        const fetchEarliestDate = async () => {
            const resp = await HistoryService.getEarliestDateAvailable();
            if (resp.ok) {
                const earliestDate = await resp.json();
                if (earliestDate.slice(0,7) < earliestMonth) {
                    appendMonth();
                }
                setEarliestDate(earliestDate);
            }
        };
        fetchEarliestDate();
    }, []);


    // Navigate to detailed view for selected date
    const handleDateSelect = useCallback((date: string) => {
        navigation.navigate("HistoricalData", { date });
    }, [navigation]);
    return(
        <>
            {/* Month header with navigation arrows */}
            <View className="flex-row justify-between m-4 items-center relative">
                {/* Previous month button (only show if not at earliest date) */}
                { earliestDate < months[currentMonthIndex].toISOString().slice(0,7) &&
                    <Pressable className="p-1 pr-3 absolute left-0" onPress={() => {
                        appendMonth();
                        setTimeout(() => {
                            flatListRef.current?.scrollToIndex({ index: currentMonthIndex + 1, animated: true });
                        }, 100);
                    }}>
                        <Image source={require('../../../assets/images/Back.png')} className="w-6 h-6" />
                    </Pressable>
                }
                {/* Current month display */}
                <Text className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">{displayMonthName}</Text>
                {/* Next month button (only show if not at current month) */}
                {currentMonthIndex > 0 &&
                    <Pressable className="p-1 pl-3 absolute right-0" onPress={() => {
                        flatListRef.current?.scrollToIndex({ index: currentMonthIndex - 1, animated: true });
                    }}>
                        <Image source={require('../../../assets/images/Back.png')} className="w-6 h-6 rotate-180" />
                    </Pressable>
                }
            </View>
            
            {/* Swipeable month container */}
            <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={months}
                inverted
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
                onMomentumScrollEnd={handleMomentumScrollEnd}
            />
        </>
    );
}

export default Calender;