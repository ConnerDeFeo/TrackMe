import { Text, View } from "react-native";

const TimeDistanceDisplay = ({ time, distance }: { time: number; distance: number }) => {
  return (
    <View className="flex flex-row justify-between items-center bg-gray-100 p-2 rounded-md mb-1">
        <Text className="text-gray-700">Distance: {distance}m</Text>
        <Text className="text-gray-700">Time: {time}s</Text>
    </View>
  );
};

export default TimeDistanceDisplay;
