import { Text, View } from "react-native";
import { ExerciseType } from "../../constants/Enums";
import { FontAwesome5 } from '@expo/vector-icons';
import { Exercise } from "../../types/workouts/Exercise";

const RenderExercise = ({ exercise }: { exercise: Exercise }) => {

    const displayRepRange = (minReps?: number, maxReps?: number) => {
        if(!minReps || (minReps <=1 && !maxReps)) return '';
        if(maxReps && maxReps !== minReps) {
            return `${minReps}-${maxReps} x `;
        }
        return `${minReps} x `;
    }
    // Choose rendering based on the exercise type
    switch (exercise.type) {
        case ExerciseType.Strength:
            // Strength exercise: show dumbbell icon, reps and description
            return (
                <View className="flex-row items-center">
                    <FontAwesome5 name="dumbbell" size={14} color="#4B5563" />
                    <Text className="text-gray-700 ml-3 font-bold">
                        {/* Show reps if available */}
                        {displayRepRange(exercise.minReps, exercise.maxReps)}
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
                        <Text className="font-bold">
                            {/* Show reps if available */}
                            {displayRepRange(exercise.minReps, exercise.maxReps)}
                            {exercise.distance}m
                        </Text>
                    </Text>
                </View>
            );

        default:
            if (!exercise.minReps) return null;
            let display:string;
            if (exercise.maxReps) {
                const minMinutes = Math.floor(exercise.minReps / 60);
                const minSeconds = (exercise.minReps % 60).toString().padStart(2, '0');
                const maxMinutes = Math.floor(exercise.maxReps / 60);
                const maxSeconds = (exercise.maxReps % 60).toString().padStart(2, '0');
                display = `${minMinutes}:${minSeconds} - ${maxMinutes}:${maxSeconds}`;
            } else {
                const minutes = Math.floor(exercise.minReps / 60);
                const seconds = (exercise.minReps % 60).toString().padStart(2, '0');
                display = `${minutes}:${seconds}`;
            }
            return (
                <View className="flex-row items-center">
                    <FontAwesome5 name="clock" size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 ml-3 text-base">
                        Rest: {display}
                    </Text>
                </View>
            );
    }
}

export default RenderExercise;