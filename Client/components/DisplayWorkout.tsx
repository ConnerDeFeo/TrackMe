import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

const DisplayWorkout: React.FC<{ workout: any }> = ({ workout }) => {
    const navigation = useNavigation<any>();
    const exercises = workout.exercises || [];
    if (!workout['title'])
        return <></>;
    console.log(workout)
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