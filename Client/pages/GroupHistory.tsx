import { useState } from "react";
import { Text, View } from "react-native";
import SearchDate from "../components/SearchDate";

const GroupHistory = () => {
    const [groupHistory, setGroupHistory] = useState<Record<string, any>>({});
    // Function to handle date search
    const handleDateSearch = async (dateInput:string) => {
        alert(`Searching group history for date: ${dateInput}`);
    };
    const handleClear = async () => {
        alert("Clearing group history search results");
    }
    return(
        <View className="mt-[4rem]">
            <Text className="text-4xl font-bold p-4">Group History</Text>
            <SearchDate
                handleDateSearch={handleDateSearch}
                handleClear={handleClear}
            />
        </View>
    );
}
export default GroupHistory;