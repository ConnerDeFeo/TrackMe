import { Text, Pressable, View } from "react-native";
import { useState } from "react";
import RenderExercise from "./RenderExercise";
import Section from "../../../types/workouts/Section";
import Workout from "../../../types/workouts/Workout";

const CollapsibleWorkoutDisplay = ({ workout }: { workout: Workout }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const sections: Array<Section> = workout.sections || [];
    
    if (!workout['title']) {
        return null;
    }

    return (
        <View className="bg-white shadow-md rounded-2xl overflow-hidden border trackme-border-gray mb-3">
            {/* Collapsible Header */}
            <Pressable 
                onPress={() => setIsExpanded(!isExpanded)}
                className="p-4 bg-gray-50 border-b border-gray-200 flex-row items-center justify-between"
            >
                <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={1}>
                    {workout.title}
                </Text>
                <Text className="text-2xl text-gray-600 ml-2">
                    {isExpanded ? '▼' : '▶'}
                </Text>
            </Pressable>
            
            {/* Expanded Content */}
            {isExpanded && (
                <View className="p-4">
                    {/* Description */}
                    {workout.description && (
                        <Text className="text-gray-600 text-sm mb-4">{workout.description}</Text>
                    )}
                    
                    {/* Sections */}
                    {sections.map((section, index) => (
                        <View key={index}>
                            {/* Section Header */}
                            <View className="flex-row items-center mb-3">
                                {section.name && (
                                    <Text className="text-md font-semibold uppercase tracking-wider">
                                        {section.name}
                                    </Text>
                                )}
                                {(section.minSets > 1 || section.maxSets) && (
                                    <Text className="text-md font-semibold text-gray-500 ml-2">
                                        ({section.minSets}
                                        {section.maxSets && section.minSets !== section.maxSets 
                                            ? ` - ${section.maxSets}` 
                                            : ''} Sets)
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
                            {index < sections.length - 1 && (
                                <View className="border-b border-gray-200 my-4" />
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default CollapsibleWorkoutDisplay;