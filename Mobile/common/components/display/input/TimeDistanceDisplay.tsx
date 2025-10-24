import { Text, View } from "react-native";
import DateService from "../../../../services/DateService";

// Basic display component for showing time and distance information
const TimeDistanceDisplay = ({ time, distance, selected }: { time: number; distance: number; selected?: boolean }) => {
  return (
    <View className={`flex flex-row justify-between items-center bg-blue-100 p-2 rounded-md mb-1 border-2 ${selected ? "border-red-500" : "border-transparent"}`}>
      <Text className="font-semibold">Distance: {distance}m</Text>
      <Text className="font-semibold">{DateService.formateSecondsToTimeString(time)}</Text>
    </View>
  );
};

export default TimeDistanceDisplay;
