import { ExerciseType } from "../../constants/Enums";
import type { Exercise } from "../../types/workouts/Exercise";

const DisplayExercise = ({ exercise, index }: { exercise: Exercise; index: number }) => {
    // Return an emoji icon based on the exercise type
    const getExerciseIcon = (type: string) => {
        switch (type) {
            case 'run':
                return '🏃';
            case 'rest':
                return '⏱️';
            case 'strength':
                return '💪';
            default:
                return '•';
        }
    };

    // Format reps display (e.g., "5-10" or "5")
    const formatReps = (minReps?: number, maxReps?: number) => {
        if (maxReps && maxReps !== minReps) {
            return `${minReps}-${maxReps}`;
        }
        return minReps ? `${minReps}` : '';
    };

    return (
        <div
            key={index}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
        >
            {/* Icon for the exercise */}
            <span className="text-2xl">{getExerciseIcon(exercise.type)}</span>

            <div className="flex-1">
                {/* Exercise type label */}
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold uppercase trackme-blue">
                        {exercise.type}
                    </span>
                </div>

                {/* Details for running exercises */}
                {exercise.type === ExerciseType.Run && (
                    <div className="mt-1">
                        <p className="text-sm font-medium text-gray-900">
                            {exercise.distance} {exercise.measurement}
                        </p>
                        <p className="text-xs text-gray-600">
                            Reps: {formatReps(exercise.minReps, exercise.maxReps)}
                        </p>
                    </div>
                )}

                {/* Details for rest periods */}
                {exercise.type === ExerciseType.Rest && (
                    <div className="mt-1">
                        <p className="text-sm font-medium text-gray-900">Rest Period</p>
                        <p className="text-xs text-gray-600">
                            {formatReps(exercise.minReps, exercise.maxReps)} seconds
                        </p>
                    </div>
                )}

                {/* Details for strength exercises */}
                {exercise.type === ExerciseType.Strength && (
                    <div className="mt-1">
                        <p className="text-sm font-medium text-gray-900">
                            {exercise.description}
                        </p>
                        <p className="text-xs text-gray-600">
                            Reps: {formatReps(exercise.minReps, exercise.maxReps)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DisplayExercise;