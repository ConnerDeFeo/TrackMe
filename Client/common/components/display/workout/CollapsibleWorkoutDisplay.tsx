import { Text, Pressable, View } from "react-native";
import { useState } from "react";
import RenderExercise from "./RenderExercise";
import Section from "../../../types/workouts/Section";
import Workout from "../../../types/workouts/Workout";
import DisplaySection from "./DisplaySection";
import TrackMeButton from "../TrackMeButton";

const CollapsibleWorkoutDisplay = ({ workout, onPress, onPressText }: { workout: Workout, onPress?: () => void, onPressText?: string }) => {
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
                        <DisplaySection section={section} index={index} key={index} sections={sections} />
                    ))}
                    {onPress && onPressText && (
                        <TrackMeButton
                            text={onPressText}
                            onPress={onPress}
                            className="mt-4"
                        />
                    )}
                </View>
            )}
        </View>
    );
};

export default CollapsibleWorkoutDisplay;