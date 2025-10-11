import { Image, Text, View } from "react-native";
import { ExerciseType } from "../../../constants/Enums";
import { FontAwesome5 } from '@expo/vector-icons';
import { Exercise } from "../../../types/workouts/Exercise";
import { ReactElement } from "react";

// RenderExercise: displays an exercise with the appropriate icon and details
const RenderExercise = ({ exercise }: { exercise: Exercise }) => {

    // Helper to format the repetition range display (e.g., "3-5 x " or "5 x ")
    const displayRepRange = (minReps?: number, maxReps?: number): string => {
        if (!minReps || (minReps <= 1 && !maxReps)) {
            // No rep info to show
            return '';
        }
        if (maxReps && maxReps !== minReps) {
            // Range of reps
            return `${minReps}-${maxReps} x `;
        }
        // Single rep count
        return `${minReps} x `;
    };

    const renderExerciseByType = () => {
        // Choose rendering based on the exercise type
        switch (exercise.type) {
            case ExerciseType.Strength:
                // Strength: dumbbell icon, reps and description
                return(
                    <View className="flex-row items-center flex-1">
                        <FontAwesome5 name="dumbbell" size={14} color="#4B5563" />
                        <Text className="text-gray-700 ml-3 font-bold">
                            {displayRepRange(exercise.minReps, exercise.maxReps)}
                            {exercise.description}
                        </Text>
                    </View>
                );

            case ExerciseType.Run:
                // Run: running icon and either reps or distance
                return(
                    <View className="flex-row items-center flex-1">
                        <FontAwesome5 name="running" size={14} color="#4B5563" />
                        <Text className="text-gray-700 ml-3 text-base">
                            <Text className="font-bold">
                                {displayRepRange(exercise.minReps, exercise.maxReps)}
                                {exercise.distance}m
                            </Text>
                        </Text>
                    </View>
                );

            default:
                // Default: treat as rest period
                if (!exercise.minReps) {
                    // No rest defined
                    return null;
                }

                // Format rest time as MM:SS or a range MM:SS - MM:SS
                let display: string;
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
                    <View className="flex-row items-center flex-1">
                        <FontAwesome5 name="clock" size={14} color="#9CA3AF" />
                        <Text className="text-gray-400 ml-3 text-base">
                            Rest: {display}
                        </Text>
                    </View>
                );
        }
    }  
    return (
        <>
            {renderExerciseByType()}
            {
                exercise.notes && (
                    <View className="mt-1 ml-6 pl-2 border-l-2 border-blue-200">
                        <Text className="text-sm text-gray-600 italic">{exercise.notes}</Text>
                    </View>
                )
            }
        </>
    );
};

export default RenderExercise;