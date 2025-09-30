import { Text, Pressable, View } from "react-native";
import Section from "../../types/Sections";
import RenderExercise from "./RenderExercise";

const DisplayWorkout: React.FC<{ workout: any, onPress?:()=>void, onRemove?: (id: string) => void }> = ({ workout, onPress, onRemove }) => {
    const sections: Array<Section> = workout.sections || [];
    
    if (!workout['title'])
        return null;

    return (
        <Pressable 
            onPress={onPress}
            className="my-3 mx-2"
        >
            <View className="bg-white shadow-md rounded-2xl overflow-hidden">
                {/* Workout Header */}
                <View className="p-4 bg-gray-50 border-b border-gray-200">
                    <View className="flex-row justify-between items-start">
                        <Text className="text-xl font-bold text-gray-800 max-w-[85%]" numberOfLines={2}>{workout.title}</Text>
                        {onRemove && 
                            <Pressable onPress={() => onRemove(workout.workoutId)} className="py-1">
                                <Text className="trackme-red font-semibold">Remove</Text>
                            </Pressable>
                        }
                    </View>
                    {workout.description && <Text className="text-gray-600 text-sm mt-1">{workout.description}</Text>}
                </View>
                
                {/* Sections Container */}
                <View className="p-4">
                    {sections.map((section, index) => (
                        <View key={index}>
                            {/* Section Header */}
                            <View className="flex-row items-center mb-3">
                                <Text className="text-md font-semibold uppercase tracking-wider">{section.name}</Text>
                                {section.sets && (
                                    <Text className="text-md font-semibold text-gray-500 ml-2">
                                        ({section.sets} Sets)
                                    </Text>
                                )}
                            </View>

                            {/* Exercises List */}
                            {section.exercises && section.exercises.length > 0 && (
                                <View className="ml-6 gap-y-3">
                                    {section.exercises.map((exercise, partIndex) => (
                                        <RenderExercise key={partIndex} exercise={exercise} />
                                    ))}
                                </View>
                            )}
                            
                            {/* Divider between sections */}
                            {index < sections.length - 1 && <View className="border-b border-gray-200 my-4" />}
                        </View>
                    ))}
                </View>
            </View>
        </Pressable>
    );
}

export default DisplayWorkout;