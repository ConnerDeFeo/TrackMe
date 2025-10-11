import type { RunExercise } from "../../types/workouts/RunExercise";

const RunExerciseInputs = ({ exercise, partIdx, handleExerciseChange, handleRepsChange }:
    {exercise: RunExercise, partIdx: number, handleExerciseChange: (index: number, field: keyof RunExercise, value: string | number | undefined) => void, handleRepsChange: (index: number, field: 'minReps' | 'maxReps', value: string) => void}
) => {
  return(
    <>
        {/* Distance input for running */}
        <input
        type="number"
        value={exercise.distance || ''}
        onChange={e =>
            handleExerciseChange(
            partIdx,
            'distance',
            e.target.value
            )
        }
        placeholder="Distance"
        className="w-28 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
        />
        <span className="text-xs text-gray-500 flex-shrink-0">
        meters
        </span>
        <span className="text-gray-300 flex-shrink-0">|</span>
        <span className="text-xs text-gray-600 font-medium flex-shrink-0">
        Reps:
        </span>
        {/* Reps range inputs */}
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

export default RunExerciseInputs;