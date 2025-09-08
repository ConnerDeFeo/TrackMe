import { Text, TextInput, TouchableOpacity, View } from "react-native";

const SearchDate: React.FC<{dateInput: string, setDateInput: (text: string) => void, handleDateSearch: () => void}> = ({dateInput, setDateInput, handleDateSearch}) => {
    return(
        <>
            <Text className="text-lg font-semibold text-gray-700 mb-2">Search by Date:</Text>
            <View className="flex-row items-center gap-2">
                <TextInput
                    value={dateInput}
                    onChangeText={setDateInput}
                    placeholder="Enter date (YYYY-MM-DD)"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white"
                />
                <TouchableOpacity
                    onPress={handleDateSearch}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                >
                <Text className="text-white font-medium">Search</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default SearchDate;