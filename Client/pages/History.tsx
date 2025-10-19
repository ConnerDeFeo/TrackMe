import { useCallback, useEffect, useRef, useState } from "react";
import HistoryService from "../services/HistoryService";
import { Text, View, PanResponder, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateService from "../services/DateService";
import { Variables } from "../common/constants/Variables";
import RenderDay from "../common/components/history/RenderDay";
import RenderMonth from "../common/components/history/RenderMonth";

const SCREEN_WIDTH = Dimensions.get("window").width; 

const History = () => {
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    // Current month and year being viewed
    const [monthYear, setMonthYear] = useState<Date>(new Date());
    const navigation = useNavigation<any>();

    const nextMonth = useCallback(() => {
        setMonthYear(DateService.addMonths(monthYear, 1));
    }, [monthYear]);

    const prevMonth = useCallback(() => {
        setMonthYear(DateService.addMonths(monthYear, -1));
    }, [monthYear]);

    const panX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    const requiredSwipeDistance = 150;

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gesture) => {
            panX.setValue(gesture.dx - SCREEN_WIDTH);
        },
        onPanResponderRelease: (e, gesture) => {
            if (gesture.dx > requiredSwipeDistance) {
                Animated.spring(panX, { toValue: 0, useNativeDriver: true }).start(() => {
                    prevMonth();
                    panX.setValue(-SCREEN_WIDTH);
                });
            } else if (gesture.dx < -requiredSwipeDistance) {
                Animated.spring(panX, { toValue: -SCREEN_WIDTH * 2, useNativeDriver: true }).start(() => {
                    nextMonth();
                    panX.setValue(-SCREEN_WIDTH);
                });
            } else {
                Animated.spring(panX, { toValue: -SCREEN_WIDTH, useNativeDriver: true }).start();
            }
        }
    });


    const fetchAvailableDates = async (date?:string) => {
            const resp = await HistoryService.getAvailableHistoryDates(date);
            if(resp.ok) {
                const data = await resp.json();
                setAvailableDates(new Set(data));
            } else {
                setAvailableDates(new Set());
            }
        }

    useEffect(() => {
        fetchAvailableDates();  
    },[]);

    const handleDateSelect = useCallback((date: string) => {
        navigation.navigate("HistoricalData", { date });
    }, [navigation]);


    const months: Date[] = [
        DateService.addMonths(monthYear, -1),
        monthYear,
        DateService.addMonths(monthYear, 1),
    ];
    return(
        <Animated.View 
            style={{ transform: [{ translateX: panX }], width: SCREEN_WIDTH*3 }} // Three times screen width for swipe
            {...panResponder.panHandlers} 
            className="flex-row gap-x-2 mx-auto items-center justify-center"
        >
            {months.map((month, index) => 
                <View key={index} className="w-[33%]">
                    <RenderMonth
                        monthYear={month}
                        availableDates={availableDates}
                        handleDateSelect={handleDateSelect}
                    />
                </View>
            )}
        </Animated.View>
);
}

export default History;