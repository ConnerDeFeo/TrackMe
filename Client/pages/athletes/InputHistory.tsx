import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import UserService from "../../services/UserService";
import HistoryService from "../../services/HistoryService";
import SearchDate from "../../components/SearchDate";
import TimeDistanceDisplay from "../../components/display/TimeDistanceDisplay";

const InputHistory = () => {
  const [InputHistory, setInputHistory] = useState<Record<string,any>>({});

  const fetchInputHistory = async () => {
    const resp = await HistoryService.searchInputHistoryByDate();
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
  const handleDateSearch = async (dateInput:string) => {
    const resp = await HistoryService.searchInputHistoryByDate(dateInput);
    if(resp.ok){
      const historyData = await resp.json();
      setInputHistory(historyData);
    }
  };

  return (
    <View className="mt-4">
      {/* Date Search Section */}
      <SearchDate
        handleDateSearch={handleDateSearch}
        handleClear={fetchInputHistory}
      />
      
      <View className="p-4">
        {Object.keys(InputHistory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((date) => (
          <View key={date} className="mb-6 bg-white shadow-md border-l-4 rounded-lg p-4">
            <Text className="text-2xl font-bold text-gray-800 mb-3">{date}</Text>
            {Object.keys(InputHistory[date]).map((groupId) => (
              <View key={groupId} className="ml-4 mb-2">
                <Text className="text-xl font-semibold text-gray-700">{InputHistory[date][groupId].name}</Text>
                {InputHistory[date][groupId].inputs.map((inputItem: {time: number, distance: number}, index: number) => (
                    <TimeDistanceDisplay key={index} time={inputItem.time} distance={inputItem.distance} />
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