import { Text } from "react-native";

const RestDisplay = ({ restTime, selected }: { restTime: number, selected?: boolean }) => {
    const minutes = Math.floor(restTime / 60);
    const seconds = restTime % 60;
    const display = minutes > 0 ? seconds >= 30 ? `${minutes}.5 minutes` : `${minutes} minutes` : `${seconds} seconds` ;
    return (
        <Text className={`border p-2 rounded-md border-2 font-semibold text-center ${selected ? "border-red-500" : "trackme-border-gray"}`}>
            Rest: {display}
        </Text>
    );
}

export default RestDisplay;