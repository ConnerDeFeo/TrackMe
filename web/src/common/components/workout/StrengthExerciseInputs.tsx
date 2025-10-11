import type { StrengthExercise } from "../../types/workouts/StrengthExercise";

const StrengthExerciseInputs = ({ exercise, partIdx, handleExerciseChange, handleRepsChange }:
    {
        exercise: StrengthExercise, 
        partIdx: number, 
        handleExerciseChange: (index: number, field: keyof StrengthExercise, value: string | number | undefined) => void, 
        handleRepsChange: (index: number, field: 'minReps' | 'maxReps', value: string) => void
    }
) => {
    return(
        <>
            {/* Description input for strength exercises */}
            <input
            type="text"
            value={exercise.description || ''}
            onChange={e =>
                handleExerciseChange(
                partIdx,
                'description',
                e.target.value
                )
            }
            placeholder="Exercise description..."
            className="flex-1 min-w-0 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />
            <span className="text-gray-300 flex-shrink-0">|</span>
            <span className="text-xs text-gray-600 font-medium flex-shrink-0">
            Reps:
            </span>
            {/* Reps range for strength */}
            <input
            type="number"
            value={exercise.minReps || ''}
            onChange={e =>
                handleRepsChange(partIdx, 'minReps', e.target.value)
            }
            placeholder="Min"
            className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />
            <span className="text-gray-400 flex-shrink-0">-</span>
            <input
            type="number"
            value={exercise.maxReps || ''}
            onChange={e =>
                handleRepsChange(partIdx, 'maxReps', e.target.value)
            }
            placeholder="Max"
            className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
            />
        </>
    );
}   
export default StrengthExerciseInputs;