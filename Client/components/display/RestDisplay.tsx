import { Text } from "react-native";

const RestDisplay = ({ restTime, selected }: { restTime: number, selected?: boolean }) => {
    return (
        <Text>
            Rest Time: {restTime} seconds
        </Text>
    );
}

export default RestDisplay;