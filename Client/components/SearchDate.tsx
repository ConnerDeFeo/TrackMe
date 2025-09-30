import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";

// SearchDate component props:
// - handleDateSearch: callback when a valid date is submitted
// - handleClear: callback to clear the date filter externally
const SearchDate: React.FC<{
    handleDateSearch: (dateInput: string) => void,
    handleClear: () => void
}> = ({ handleDateSearch, handleClear }) => {
    // Local state for the currently displayed filter label
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Local state for the TextInput value
    const [dateInput, setDateInput] = useState<string>("");

    // Called when user taps "Search"
    const handleSearch = async () => {
        if (!dateInput) return;  // nothing to do if input is empty
        // Remove whtitespace
        const trimmedInput = dateInput.trim();
        // Only accept YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(trimmedInput)) {
            // Update local label and notify parent
            setSelectedDate(trimmedInput);
            handleDateSearch(trimmedInput);
        } else {
            // Alert user if format is invalid
            alert("Please enter a valid date format (YYYY-MM-DD)");
        }
    };

    // Clears both local and external date filters
    const handleClearDateFilter = () => {
        setSelectedDate("");
        setDateInput("");
        handleClear();
    };

    return (
        <View className="px-4">
            {/* Section title */}
            <Text className="text-lg font-semibold text-gray-700 mb-2">
                Search by Date:
            </Text>

            {/* Input row: text input + search button */}
            <View className="flex-row items-center gap-2">
                <TextInput
                    value={dateInput}
                    onChangeText={setDateInput}
                    placeholder="Enter date (YYYY-MM-DD)"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white"
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    className="trackme-bg-blue px-4 py-2 rounded-lg"
                >
                    <Text className="text-white font-medium">Search</Text>
                </TouchableOpacity>
            </View>

            {/* Display active filter and clear button if a date is selected */}
            {selectedDate && (
                <View className="flex-row items-center justify-between mt-2 p-2 bg-gray-100 rounded-lg">
                    <Text className="text-gray-700">
                        Filtering by: {selectedDate}
                    </Text>
                    <TouchableOpacity onPress={handleClearDateFilter}>
                        <Text className="text-red-500 font-medium">Clear</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default SearchDate;