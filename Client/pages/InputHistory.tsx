import { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import UserService from "../services/UserService";
import HistoryService from "../services/HistoryService";

const InputHistory = () => {
  const [InputHistory, setInputHistory] = useState<Record<string,any>>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");

  //Fetch input history for the athlete when the component mounts
  useEffect(() => {
    const fetchInputHistory = async () => {
      const athleteId = await UserService.getUserId();
      const resp = await HistoryService.getWorkoutHistory(athleteId!);
      if (resp.ok){
        const historyData = await resp.json();
        setInputHistory(historyData);
      }
    };
    fetchInputHistory();
  }, []);

  // Function to handle date search
  const handleDateSearch = () => {
    if (dateInput) {
      // Validate date format (MM-DD-YYYY only)
      const dateRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;
      if (dateRegex.test(dateInput)) {
        setSelectedDate(dateInput);
        // Here you can make your backend call with the selectedDate
        console.log("Date selected for backend call:", dateInput);
        // Example: fetchHistoryByDate(dateInput);
      } else {
        alert("Please enter a valid date format (MM-DD-YYYY)");
      }
    }
  };

  // Function to clear date filter
  const clearDateFilter = () => {
    setSelectedDate("");
    setDateInput("");
  };

  return (
    <View className="mt-[4rem]">
      <Text className="text-4xl font-bold p-4">Input History</Text>
      
      {/* Date Search Section */}
      <View className="px-4 pb-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Search by Date:</Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            value={dateInput}
            onChangeText={setDateInput}
            placeholder="Enter date (MM-DD-YYYY)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white"
          />
          <TouchableOpacity
            onPress={handleDateSearch}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Search</Text>
          </TouchableOpacity>
        </View>
        
        {selectedDate && (
          <View className="flex-row items-center justify-between mt-2 p-2 bg-gray-100 rounded-lg">
            <Text className="text-gray-700">Filtering by: {selectedDate}</Text>
            <TouchableOpacity onPress={clearDateFilter}>
              <Text className="text-red-500 font-medium">Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View className="p-4">
        {Object.keys(InputHistory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((date) => (
          <View key={date} className="mb-6 bg-white shadow-md border-l-4 border-l-red-500 rounded-lg p-4">
            <Text className="text-2xl font-bold text-gray-800 mb-3">{new Date(date).toLocaleDateString()}</Text>
            {Object.keys(InputHistory[date]).map((groupId) => (
              <View key={groupId} className="ml-4 mb-2">
                <Text className="text-xl font-semibold text-gray-700">{InputHistory[date][groupId].name}</Text>
                {InputHistory[date][groupId].inputs.map((inputItem: {time: number, distance: number}, index: number) => (
                    <Text key={index} className="text-base text-gray-600 pl-4">Time: {inputItem.time}, Distance: {inputItem.distance}</Text>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default InputHistory;