import { Text, View } from "react-native";
import { ExerciseType } from "../../assets/constants/Enums";
import { Exercise } from "../../types/Exercise";
import { FontAwesome5 } from '@expo/vector-icons';

const RenderExercise = ({ exercise }: { exercise: Exercise }) => {
    // Choose rendering based on the exercise type
    switch (exercise.type) {
        case ExerciseType.Strength:
            // Strength exercise: show dumbbell icon, reps and description
            return (
                <View className="flex-row items-center">
                    <FontAwesome5 name="dumbbell" size={14} color="#4B5563" />
                    <Text className="text-gray-700 ml-3 font-bold">
                        {/* Show reps if available */}
                        {exercise.reps ? `${exercise.reps}x ` : ''}
                        {exercise.description}
                    </Text>
                </View>
            );

        case ExerciseType.Run:
            // Run exercise: show running icon and distance
            return (
                <View className="flex-row items-center">
                    <FontAwesome5 name="running" size={14} color="#4B5563" />
                    <Text className="text-gray-700 ml-3 text-base">
                        <Text className="font-bold">{exercise.distance}m</Text>
                    </Text>
                </View>
            );

        default:
            // Rest period: calculate minutes and seconds, show clock icon
            const minutes = Math.floor(exercise.duration / 60);
            const seconds = (exercise.duration % 60).toString().padStart(2, '0');
            return (
                <View className="flex-row items-center">
                    <FontAwesome5 name="clock" size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 ml-3 text-base">
                        Rest: {minutes}:{seconds}
                    </Text>
                </View>
            );
    }
}

export default RenderExercise;