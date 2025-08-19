import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Exercise from "../types/Exersise";

const DisplayWorkout: React.FC<{ workout: any }> = ({ workout }) => {
    const navigation = useNavigation<any>();
    // Extract exercises array from workout, defaulting to empty array if undefined
    const exercises: Array<Exercise> = workout.exercises || [];
    
    // Don't render anything if workout doesn't have a title
    if (!workout['title'])
        return <></>;
    
    return (
        // Main touchable container that navigates to CreateWorkout screen when pressed
        <TouchableOpacity 
            onPress={() => navigation.navigate('CreateWorkout', { workout: workout })}
            className="active:opacity-80"
        >
            {/* Main workout card container */}
            <View className="bg-white border border-gray-200 shadow-md my-3 mx-2 p-5 rounded-xl">
                {/* Workout header section with title and description */}
                <View className="mb-4">
                    <Text className="text-xl font-bold text-gray-800 mb-2">{workout.title}</Text>
                    <Text className="text-gray-600 text-sm leading-5">{workout.description}</Text>
                </View>
                
                {/* Exercises list container */}
                <View className="space-y-4">
                    {exercises.map((exercise, index) => (
                        /* Individual exercise card */
                        <View key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-red-500">
                            {/* Exercise number header */}
                            <Text className="font-semibold text-red-600 mb-3 text-base">
                                Exercise {index + 1}
                            </Text>
                            
                            {/* Exercise details container */}
                            <View className="space-y-2">
                                {/* Exercise name */}
                                <Text className="text-gray-800 font-medium">
                                    <Text className="text-gray-500">Name: </Text>
                                    {exercise.name}
                                </Text>
                                {/* Number of sets */}
                                <Text className="text-gray-800">
                                    <Text className="text-gray-500">Sets: </Text>
                                    {exercise.sets}
                                </Text>
                                {/* Number of reps */}
                                <Text className="text-gray-800">
                                    <Text className="text-gray-500">Reps: </Text>
                                    {exercise.reps}
                                </Text>
                                
                                {/* Exercise parts section (if any exist) */}
                                {exercise.exerciseParts && exercise.exerciseParts.length > 0 && (
                                    <View className="mt-3">
                                        <Text className="text-gray-500 font-medium mb-2">Parts:</Text>
                                        {exercise.exerciseParts.map((part, partIndex) => (
                                            /* Individual exercise part with distance and measurement */
                                            <View key={partIndex} className="ml-3 py-1">
                                                <Text className="text-gray-700">
                                                    • Distance: {part.distance} {part.measurement}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default DisplayWorkout;