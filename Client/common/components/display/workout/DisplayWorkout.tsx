import { Text, Pressable, View } from "react-native";
import RenderExercise from "./RenderExercise";
import Section from "../../../types/workouts/Section";
import Workout from "../../../types/workouts/Workout";
import DisplaySection from "./DisplaySection";

const DisplayWorkout: React.FC<{ workout: Workout, onPress?:()=>void}> = ({ workout, onPress }) => {
    const sections: Array<Section> = workout.sections || [];
    
    if (!workout['title'])
        return null;
    return (
        <Pressable 
            onPress={onPress}
        >
            <View className="bg-white shadow-md rounded-2xl overflow-hidden border trackme-border-gray">
                {/* Workout Header */}
                <View className="p-4 bg-gray-50 border-b border-gray-200">
                    <Text className="text-xl font-bold text-gray-800" numberOfLines={2}>{workout.title}</Text>
                    {workout.description && <Text className="text-gray-600 text-sm mt-1">{workout.description}</Text>}
                </View>
                
                {/* Sections Container */}
                <View className="p-4">
                    {sections.map((section, index) => (
                        <DisplaySection section={section} index={index} key={index} sections={sections} />
                    ))}
                </View>
            </View>
        </Pressable>
    );
}

export default DisplayWorkout;