import { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import UserService from "../services/UserService";
import HistoryService from "../services/HistoryService";

const InputHistory = () => {
  const [InputHistory, setInputHistory] = useState<Record<string,any>>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateInput, setDateInput] = useState<string>("");

  const fetchInputHistory = async () => {
    const athleteId = await UserService.getUserId();
    const resp = await HistoryService.getWorkoutHistory(athleteId!);
    if (resp.ok){
      const historyData = await resp.json();
      setInputHistory(historyData);
    }
  };

  //Fetch input history for the athlete when the component mounts
  useEffect(() => {
    fetchInputHistory();
  }, []);

  // Function to handle date search
  const handleDateSearch = async () => {
    if (dateInput) {
      // Validate date format (YYYY-MM-DD only)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(dateInput)) {
        setSelectedDate(dateInput);
        const athleteId = await UserService.getUserId();
        const resp = await HistoryService.searchInputHistoryByDate(athleteId!, dateInput);
        if(resp.ok){
          const historyData = await resp.json();
          console.log(dateInput);
          console.log("Fetched history data for date search:", historyData);
          setInputHistory(historyData);
        }
      } else {
        alert("Please enter a valid date format (YYYY-MM-DD)");
      }
    }
  };

  // Function to clear date filter
  const clearDateFilter = () => {
    setSelectedDate("");
    setDateInput("");
    fetchInputHistory();
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
            <Text className="text-2xl font-bold text-gray-800 mb-3">{date}</Text>
            {Object.keys(InputHistory[date]).map((groupId) => (
              <View key={groupId} className="ml-4 mb-2">
                <Text className="text-xl font-semibold text-gray-700">{InputHistory[date][groupId].name}</Text>
                {InputHistory[date][groupId].inputs.map((inputItem: {time: number, distance: number}, index: number) => (
                    <View key={index} className="flex-row items-center pl-4 py-1">
                      <Text className="text-base text-gray-600 w-24">{inputItem.distance}m</Text>
                      <Text className="text-base text-gray-800 font-semibold">{inputItem.time}s</Text>
                    </View>
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