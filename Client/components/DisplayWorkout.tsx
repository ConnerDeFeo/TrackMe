import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

const DisplayWorkout: React.FC<{ workout: any }> = ({ workout }) => {
    const navigation = useNavigation<any>();
    if (!workout['title'])
        return <></>;
    return (
        <TouchableOpacity onPress={() => navigation.navigate('CreateWorkout', { workout: workout })}>
            <View className="border my-2">
                <Text>Title: {workout.title}</Text>
                <Text>Description: {workout.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default DisplayWorkout;