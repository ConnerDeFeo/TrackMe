import { Text } from "react-native";

const RestDisplay = ({ restTime, selected }: { restTime: number, selected?: boolean }) => {
    return (
        <Text className={`bg-gray-100 p-2 rounded-md mb-1 border-2 text-gray-700 text-center ${selected ? "border-red-500" : "border-transparent"}`}>
            Rest: {restTime} s
        </Text>
    );
}

export default RestDisplay;