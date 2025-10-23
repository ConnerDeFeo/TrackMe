import { Text, View } from "react-native";
import Section from "../../../types/workouts/Section";
import RenderExercise from "./RenderExercise";

const DisplaySection = ({ section, index, sections }: { section: Section; index: number; sections: Section[] })=>{
    return(
        <View key={index}>
            {/* Section Header */}
            <View className="flex-row items-center mb-3">
                {section.name && <Text className="text-md font-semibold uppercase tracking-wider">{section.name}</Text>}
                {(section.minSets > 1 || section.maxSets) && (
                    <Text className="text-md font-semibold text-gray-500 ml-2">
                        ({section.minSets}{section.maxSets && section.minSets !== section.maxSets ? ` - ${section.maxSets}` : ''} Sets)
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
    );
}

export default DisplaySection;