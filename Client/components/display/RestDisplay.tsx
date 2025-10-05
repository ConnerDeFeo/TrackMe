import { Text } from "react-native";

const RestDisplay = ({ restTime, selected }: { restTime: number, selected?: boolean }) => {
    const minutes = Math.floor(restTime / 60);
    const seconds = restTime % 60;
    const display = seconds >= 30 ? `${minutes}.5 minutes` : `${minutes} minutes`;
    return (
        <Text className={`bg-gray-100 p-2 rounded-md mb-1 border-2 text-gray-700 text-center ${selected ? "border-red-500" : "border-transparent"}`}>
            Rest: {display}
        </Text>
    );
}

export default RestDisplay;