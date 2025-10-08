import { ExerciseType } from "../../constants/Enums";
import { Variables } from "../../constants/Variables";
import type { Exercise } from "../../types/workouts/Exercise";
import type { Rest } from "../../types/workouts/Rest";
import type { Section } from "../../types/workouts/Section";

const ExerciseCreation = ({ exercises, handleExerciseRemoval, setSections, idx }:
  {
    exercises: Exercise[],
    handleExerciseRemoval: (partIdx: number) => void,
    setSections: React.Dispatch<React.SetStateAction<Section[]>>,
    idx: number
  }
) => {

  // Generic handler to update any field of an exercise at a given index
  const handleExerciseChange = (partIdx: number, field: string, value: any) => {
    // Create a shallow copy of the exercises array to avoid mutating props directly
    const updatedExercises = [...exercises];
    // Update the specific field on the copied exercise
    (updatedExercises[partIdx] as any)[field] = value;

    // Update the parent sections state to include the modified exercises
    setSections(prevSections => prevSections.map((section, sectionIdx) =>
      sectionIdx === idx ? { ...section, exercises: updatedExercises } : section
    ));
  };

  // Specialized handler for rest durations: minutes or seconds for min/max ranges
  const handleRestChange = (partIdx: number, field: 'minReps' | 'maxReps', unit: 'minutes' | 'seconds', value: string) => {
    const numericValue = value ? parseInt(value) : 0;
    if (isNaN(numericValue)) return;

    // Get current exercise and the current duration for the specified field
    const currentExercise = exercises[partIdx] as Rest;
    const currentDuration = currentExercise[field] || 0;
    const currentMinutes = Math.floor(currentDuration / 60);
    const currentSeconds = currentDuration % 60;

    // Recalculate total duration based on which unit was updated
    let newDuration = 0;
    if (unit === 'minutes') {
      newDuration = numericValue * 60 + currentSeconds;
    } else {
      newDuration = currentMinutes * 60 + numericValue;
    }
    // Delegate to the generic change handler
    handleExerciseChange(partIdx, field, newDuration);
  };

  const handleRepsChange = (partIdx: number, field: 'minReps' | 'maxReps', value: string) => {
    const numericValue = value ? parseInt(value) : undefined;
    if (value && isNaN(numericValue!)) return;
    handleExerciseChange(partIdx, field, numericValue);
  }

  return(
    <div className="space-y-2">
      {exercises.map((exercise, partIdx) => (
        <div key={partIdx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
          {/* Icon */}
          <span className="text-lg flex-shrink-0">
            {exercise.type === ExerciseType.Run ? Variables.Icons.run : 
             exercise.type === ExerciseType.Strength ? Variables.Icons.strength : 
             Variables.Icons.rest}
          </span>

          {/* Inputs - All on one line with better spacing */}
          {exercise.type === ExerciseType.Run ? (
            <>
              <input 
                type="number" 
                value={exercise.distance || ''} 
                onChange={(e) => handleExerciseChange(partIdx, 'distance', e.target.value)} 
                placeholder="Distance"
                className="w-28 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">meters</span>
              <span className="text-gray-300 flex-shrink-0">|</span>
              <span className="text-xs text-gray-600 font-medium flex-shrink-0">Reps:</span>
              <input 
                type="number" 
                value={exercise.minReps || ''} 
                onChange={(e) => handleRepsChange(partIdx, 'minReps', e.target.value)} 
                placeholder="Min"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
              />
              <span className="text-gray-400 flex-shrink-0">-</span>
              <input 
                type="number" 
                value={exercise.maxReps || ''} 
                onChange={(e) => handleRepsChange(partIdx, 'maxReps', e.target.value)} 
                placeholder="Max"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
              />
            </>
          ) : exercise.type === ExerciseType.Strength ? (
            <>
              <input 
                type="text" 
                value={exercise.description || ''} 
                onChange={(e) => handleExerciseChange(partIdx, 'description', e.target.value)} 
                placeholder="Exercise description..."
                className="flex-1 min-w-0 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
              />
              <span className="text-gray-300 flex-shrink-0">|</span>
              <span className="text-xs text-gray-600 font-medium flex-shrink-0">Reps:</span>
              <input 
                type="number" 
                value={exercise.minReps || ''} 
                onChange={(e) => handleRepsChange(partIdx, 'minReps', e.target.value)} 
                placeholder="Min"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
              />
              <span className="text-gray-400 flex-shrink-0">-</span>
              <input 
                type="number" 
                value={exercise.maxReps || ''} 
                onChange={(e) => handleRepsChange(partIdx, 'maxReps', e.target.value)} 
                placeholder="Max"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
              />
            </>
          ) : (
            <>
              <span className="text-xs text-gray-600 font-medium flex-shrink-0">Rest:</span>
              <input 
                type="number" 
                value={exercise.minReps || ''} 
                onChange={(e) => handleRestChange(partIdx, 'minReps', 'seconds', e.target.value)} 
                placeholder="Min"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
              />
              <span className="text-gray-400 flex-shrink-0">-</span>
              <input 
                type="number" 
                value={exercise.maxReps || ''} 
                onChange={(e) => handleRestChange(partIdx, 'maxReps', 'seconds', e.target.value)} 
                placeholder="Max"
                className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
              />
              <span className="text-xs text-gray-500 flex-shrink-0">seconds</span>
            </>
          )}

          {/* Remove Button */}
          <button
            onClick={() => handleExerciseRemoval(partIdx)}
            className="ml-auto flex-shrink-0 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-all"
            title="Remove"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );

}

export default ExerciseCreation;