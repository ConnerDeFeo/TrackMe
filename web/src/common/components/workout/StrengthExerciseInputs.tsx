import type { StrengthExercise } from "../../types/workouts/StrengthExercise";

// Define a clear prop interface for readability
interface StrengthExerciseInputsProps {
    exercise: StrengthExercise
    partIdx: number
    handleExerciseChange: (
        index: number,
        field: keyof StrengthExercise,
        value: string | number | undefined
    ) => void
    handleRepsChange: (
        index: number,
        field: 'minReps' | 'maxReps',
        value: string
    ) => void
}

/**
 * Renders description and rep‐range inputs for a strength exercise.
 */
const StrengthExerciseInputs: React.FC<StrengthExerciseInputsProps> = ({
    exercise,
    partIdx,
    handleExerciseChange,
    handleRepsChange,
}) => {
    return (
        <div className="flex items-center space-x-2">
            {/* Description input */}
            <input
                type="text"
                value={exercise.description ?? ''}
                onChange={(e) =>
                    handleExerciseChange(partIdx, 'description', e.target.value)
                }
                placeholder="Exercise description..."
                className="flex-1 min-w-0 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />

            <span className="text-gray-300">|</span>

            {/* Reps label */}
            <span className="text-xs text-gray-600 font-medium">Reps:</span>

            {/* Minimum reps */}
            <input
                type="number"
                value={exercise.minReps ?? ''}
                onChange={(e) => handleRepsChange(partIdx, 'minReps', e.target.value)}
                placeholder="Min"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />

            <span className="text-gray-400">-</span>

            {/* Maximum reps */}
            <input
                type="number"
                value={exercise.maxReps ?? ''}
                onChange={(e) => handleRepsChange(partIdx, 'maxReps', e.target.value)}
                placeholder="Max"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />
        </div>
    )
}

export default StrengthExerciseInputs