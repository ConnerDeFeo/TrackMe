import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import UserService from "../services/UserService";
import HistoryService from "../services/HistoryService";

const InputHistory = () => {
  const [InputHistory, setInputHistory] = useState<Record<string,any>>({});

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

  console.log("Input History Data: ", InputHistory);
  return (
    <View className="mt-[4rem]">
      <Text className="text-4xl font-bold p-4">Input History</Text>
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