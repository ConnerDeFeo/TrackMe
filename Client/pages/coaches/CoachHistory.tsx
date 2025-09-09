import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SearchDate from "../../components/SearchDate";
import UserService from "../../services/UserService";
import HistoryService from "../../services/HistoryService";
import { useNavigation } from "@react-navigation/native";

const CoachHistory = () => {
    // Local state to hold the list of dates for which history exists
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const navigation = useNavigation<any>();  // Hook to navigate between screens

    // Fetch all dates that have workouts assigned when the component mounts
    const fetchAvailableHistoryDates = async () => {
        const coachId = await UserService.getUserId();  // Get current coach ID
        const resp = await HistoryService.getAvailableHistoryDates(coachId!);
        if (resp.ok) {
            const historyData = await resp.json();       // Parse response JSON
            console.log("Available history dates fetched: ", historyData);
            setAvailableDates(historyData);              // Update state with fetched dates
        }
    };

    // Run once on component mount
    useEffect(() => {
        fetchAvailableHistoryDates();
    }, []);

    // Handler called when user searches for a specific date
    const handleDateSearch = async (dateInput: string) => {
        const coachId = await UserService.getUserId();
        const resp = await HistoryService.getAvailableHistoryDates(coachId!, dateInput);
        if (resp.ok) {
            const historyData = await resp.json();
            console.log("Available history dates fetched: ", historyData);
            setAvailableDates(historyData);              // Filter state by search result
        }
    };

    return (
        <View className="mt-[4rem]">
            <Text className="text-4xl font-bold p-4">Coach History</Text>

            {/* Date search input and clear button */}
            <SearchDate
                handleDateSearch={handleDateSearch}
                handleClear={fetchAvailableHistoryDates}
            />

            <View className="p-4">
                {/* Render a button for each available date */}
                {availableDates.map((date) => (
                    <TouchableOpacity
                        key={date}
                        className="mb-6 bg-white shadow-md border-l-4 border-l-red-500 rounded-lg p-4"
                        onPress={() =>
                            navigation.navigate('HistoricalData', { date })
                        }
                    >
                        <Text className="text-2xl font-bold text-gray-800">
                            {date}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default CoachHistory;