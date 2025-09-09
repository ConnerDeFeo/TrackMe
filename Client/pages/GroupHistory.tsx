import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import SearchDate from "../components/SearchDate";
import UserService from "../services/UserService";
import HistoryService from "../services/HistoryService";

const GroupHistory = () => {
    const [availableDates, setAvailableDates] = useState<string[]>([]);

    //Fetch available dates that have workouts assigned to them
    const fetchAvailableHistoryDates = async () => {
        const coachId = await UserService.getUserId();
        const resp = await HistoryService.getAvailableHistoryDates(coachId!);
        if (resp.ok){
            const historyData = await resp.json();
            console.log("Available history dates fetched: ", historyData);
            setAvailableDates(historyData);
        }
    };

    useEffect(() => {
        fetchAvailableHistoryDates();
    }, []);
    // Function to handle date search
    const handleDateSearch = async (dateInput:string) => {
        const coachId = await UserService.getUserId();
        const resp = await HistoryService.getAvailableHistoryDates(coachId!, dateInput);
        if (resp.ok){
            const historyData = await resp.json();
            console.log("Available history dates fetched: ", historyData);
            setAvailableDates(historyData);
        }
    };
    return(
        <View className="mt-[4rem]">
            <Text className="text-4xl font-bold p-4">Group History</Text>
            <SearchDate
                handleDateSearch={handleDateSearch}
                handleClear={fetchAvailableHistoryDates}
            />
            <View className="p-4">
                {availableDates.map((date) => (
                    <View key={date} className="mb-6 bg-white shadow-md border-l-4 border-l-red-500 rounded-lg p-4">
                        <Text className="text-2xl font-bold text-gray-800">{date}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
export default GroupHistory;