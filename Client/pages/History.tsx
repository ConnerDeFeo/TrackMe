import { useCallback, useEffect, useRef, useState } from "react";
import HistoryService from "../services/HistoryService";
import { View, PanResponder, Animated, Dimensions, Text, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateService from "../services/DateService";
import RenderMonth from "../common/components/history/RenderMonth";

const SCREEN_WIDTH = Dimensions.get("window").width; 

const History = () => {
    // Current month and year being viewed
    const [monthYear, setMonthYear] = useState<Date>(new Date());
    const [displayMonthName, setDisplayMonthName] = useState<string>(monthYear.toLocaleString('default', { month: 'long', year: 'numeric' }));
    // Cached available dates with historical data
    const [availableDates, setAvailableDates] = useState<Record<string, Set<string>>>({});
    const currentMonthKey = monthYear.toISOString().slice(0,7);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const navigation = useNavigation<any>();

    const panX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    const requiredSwipeDistance = 150;

    const fetchAvailableDates = async (date?:string) => {
        const resp = await HistoryService.getAvailableHistoryDates(date);
        if(resp.ok) {
            const data = await resp.json();
            setAvailableDates({...availableDates, [date || ""]: new Set(data)});
        } else {
            setAvailableDates({...availableDates, [date || ""]: new Set()});
        }
    }

    useEffect(() => {
        panX.setValue(-SCREEN_WIDTH);
        if (!availableDates.hasOwnProperty(currentMonthKey)) {
            fetchAvailableDates(currentMonthKey);
        }
    }, [monthYear]);

    const nextMonth = () => {
        setDisplayMonthName(DateService.addMonths(monthYear, 1).toLocaleString('default', { month: 'long', year: 'numeric' }));
        setMonthYear(DateService.addMonths(monthYear, 1));
    };

    const prevMonth = () => {
        setDisplayMonthName(DateService.addMonths(monthYear, -1).toLocaleString('default', { month: 'long', year: 'numeric' }));
        setMonthYear(DateService.addMonths(monthYear, -1));
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => {
            return !isAnimating;
        },
        onPanResponderMove: (_, gesture) => {
            panX.setValue(gesture.dx - SCREEN_WIDTH);
        },
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dx > requiredSwipeDistance) {
                setDisplayMonthName(DateService.addMonths(monthYear, -1).toLocaleString('default', { month: 'long', year: 'numeric' }));
                setIsAnimating(true);
                // Swipe right - go to previous month
                Animated.spring(panX, { 
                    toValue: 7, 
                    useNativeDriver: true 
                }).start(() => {
                    prevMonth();
                    setIsAnimating(false);
                });
            } else if (gesture.dx < -requiredSwipeDistance) {
                setDisplayMonthName(DateService.addMonths(monthYear, 1).toLocaleString('default', { month: 'long', year: 'numeric' }));
                setIsAnimating(true);
                // Swipe left - go to next month
                Animated.spring(panX, { 
                    toValue: (-SCREEN_WIDTH-3.5) * 2, 
                    useNativeDriver: true 
                }).start(() => {
                    nextMonth();
                    setIsAnimating(false);
                });
            } else {
                // Snap back to center
                Animated.spring(panX, { 
                    toValue: -SCREEN_WIDTH, 
                    useNativeDriver: true 
                }).start();
            }
        }
    });

    const handleDateSelect = useCallback((date: string) => {
        navigation.navigate("HistoricalData", { date });
    }, [navigation]);


    const months: Date[] = [
        DateService.addMonths(monthYear, -1),
        monthYear,
        DateService.addMonths(monthYear, 1),
    ];

    return(
        <View className="mt-4">
            <View className="flex-row justify-between mx-4 items-center">
                <Pressable className="p-1 pr-3" onPress={prevMonth}>
                    <Image source={require('../assets/images/Back.png')} className="w-6 h-6" />
                </Pressable>
                <Text className="text-2xl font-bold">{displayMonthName}</Text>
                <Pressable className="p-1 pl-3" onPress={nextMonth}>
                    <Image source={require('../assets/images/Back.png')} className="w-6 h-6 rotate-180" />
                </Pressable>
            </View>
            <Animated.View 
                style={{ transform: [{ translateX: panX }], width: SCREEN_WIDTH*3 }} // Three times screen width for swipe
                {...panResponder.panHandlers} 
                className="flex-row gap-x-2 mx-auto justify-center"
            >
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