import { ExerciseType } from "../../constants/Enums";
import { Variables } from "../../constants/Variables";
import type { Exercise } from "../../types/workouts/Exercise";

// Component for displaying a single exercise entry
const DisplayExercise = ({
    exercise,
    index
}: {
    exercise: Exercise
    index: number
}) => {
    // Helper to format reps string:
    // - if only one rep, return empty string
    // - if min !== max, return "min-max x "
    // - else return "min x "
    const formatReps = (min?: number, max?: number) => {
        if (min === 1 && (!max || max === 1)) {
            return ""
        }
        return max && max !== min ? `${min}-${max} x ` : `${min || ""} x `
    }

    // Helper to format rest time from seconds to "Xm Ys"
    const formatRest = (sec?: number) => `${sec ? Math.floor(sec / 60) : ""}m ${sec ? `${sec % 60}s` : ""}`

    // Build the display content based on exercise type
    const getContent = () => {
        if (exercise.type === ExerciseType.Run) {
            // Running: show reps (if any), distance and measurement
            return `${formatReps(
                exercise.minReps,
                exercise.maxReps
            )}${exercise.distance} ${exercise.measurement}`
        }
        if (exercise.type === ExerciseType.Rest) {
            // Rest period: show formatted rest time
            return `Rest: ${formatRest(exercise.minReps)}`
        }
        // Default case: generic exercise description with reps
        return `${formatReps(exercise.minReps, exercise.maxReps)}${
            exercise.description
        }`
    }

    // Render the exercise with icon and content
    return (
        <div
            key={index}
            className="bg-gray-50 rounded-lg p-3"
        >
            <div className="flex items-center space-x-3">
                <span className="text-xl flex-shrink-0">
                    {Variables.Icons[exercise.type as keyof typeof Variables.Icons]}
                </span>
                <span className="text-sm text-gray-700 flex-1">{getContent()}</span>
                {exercise.notes && (
                    <span className="text-xs text-blue-600 flex-shrink-0" title={exercise.notes}>
                        {Variables.Icons.notes}
                    </span>
                )}
            </div>
            {exercise.notes && (
                <div className="mt-2 pl-9 text-xs text-gray-600 italic border-l-2 border-blue-200 break-words">
                    <span className="pl-2">{exercise.notes}</span>
                </div>
            )}
        </div>
    )
}

export default DisplayExercise