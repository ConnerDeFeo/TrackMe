import type { Rest } from "../../types/workouts/Rest";

// RestExerciseInputs component renders input fields to specify rest periods
const RestExerciseInputs = ({
    exercise,
    partIdx,
    handleRestChange,
}: {
    exercise: Rest
    partIdx: number
    handleRestChange: (
        partIdx: number,
        field: 'minReps' | 'maxReps',
        unit: 'minutes' | 'seconds',
        value: string
    ) => void
}) => {
    return (
        <>
            {/* Label for the rest inputs */}
            <span className="text-xs text-gray-600 font-medium flex-shrink-0">
                Rest:
            </span>

            {/* Minimum rest time input (seconds) */}
            <input
                type="number"
                value={exercise.minReps || ''}
                onChange={e =>
                    handleRestChange(partIdx, 'minReps', 'seconds', e.target.value)
                }
                placeholder="Min"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />

            {/* Separator between min and max inputs */}
            <span className="text-gray-400 flex-shrink-0">-</span>

            {/* Maximum rest time input (seconds) */}
            <input
                type="number"
                value={exercise.maxReps || ''}
                onChange={e =>
                    handleRestChange(partIdx, 'maxReps', 'seconds', e.target.value)
                }
                placeholder="Max"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />

            {/* Unit label */}
            <span className="text-xs text-gray-500 flex-shrink-0">
                seconds
            </span>
        </>
    )
}

export default RestExerciseInputs