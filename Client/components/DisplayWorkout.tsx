import { Text, TouchableOpacity, View } from "react-native";
import Exercise from "../types/Exersise";

const DisplayWorkout: React.FC<{ workout: any, onPress?:()=>void, onRemove?: (id: string) => void }> = ({ workout, onPress, onRemove }) => {
    // Extract exercises array from workout, defaulting to empty array if undefined
    const exercises: Array<Exercise> = workout.exercises || [];
    
    // Don't render anything if workout doesn't have a title
    if (!workout['title'])
        return <></>;
    return (
        // Main touchable container that navigates to CreateWorkout screen when pressed
        <TouchableOpacity 
            onPress={onPress}
        >
            {/* Main workout card container */}
            <View className="bg-white border border-gray-200 shadow-md my-3 mx-2 p-5 rounded-xl">
                {/* Workout header section with title and description */}
                <View className="mb-4">
                    <View className="flex flex-row justify-between items-center mb-2">
                        <Text className="text-xl font-bold text-gray-800">{workout.title}</Text>
                        {onRemove && 
                            <TouchableOpacity onPress={() => onRemove(workout.workoutId)}>
                                <Text className="text-[#E63946]">Remove</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <Text className="text-gray-600 text-sm leading-5">{workout.description}</Text>
                </View>
                
                {/* Exercises list container */}
                <View className="space-y-4">
                    {exercises.map((exercise, index) => (
                        /* Individual exercise card */
                        <View key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-red-500">
                            {/* Exercise number header */}
                            <Text className="font-semibold text-red-600 mb-3 text-base">
                                {exercise.name}
                            </Text>

                            {/* Exercise details container */}
                            {exercise.sets && exercise.reps && (
                                <View className="gap-y-2">
                                    {/* Number of sets and reps */}
                                    <Text className="font-semibold text-md">
                                        {exercise.sets} x {exercise.reps}
                                    </Text>
                                </View>
                            )}
                            {/* Exercise parts section (if any exist) */}
                            {exercise.exerciseParts && exercise.exerciseParts.length > 0 && (
                                <View>
                                    {exercise.exerciseParts.map((part, partIndex) => (
                                        /* Individual exercise part with distance and measurement */
                                        <View key={partIndex} className="ml-3 py-1">
                                            <Text className="text-gray-700">
                                                {part.distance} {part.measurement}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default DisplayWorkout;