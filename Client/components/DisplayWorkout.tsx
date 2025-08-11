import { Text, View } from "react-native";

const DisplayWorkout: React.FC<{ workout: any }> = ({ workout }) => {
    if (!workout['title'])
        return <></>;
    return (
        <View className="border my-2">
            <Text>Title: {workout.title}</Text>
            <Text>Description: {workout.description}</Text>
        </View>
    );
};

export default DisplayWorkout;