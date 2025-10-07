import { ExerciseType } from "../../constants/Enums";
import { Variables } from "../../constants/Variables";
import type { Exercise } from "../../types/workouts/Exercise";
import type { Rest } from "../../types/workouts/Rest";
import type { Section } from "../../types/workouts/Section";
import TextButton from "../TextButton";

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
    <>
      {exercises.map((exercise, partIdx) => (
        <div key={partIdx} className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            {/* Add your exercise input fields and controls here */}
            {exercise.type === ExerciseType.Run ? (
                <div>
                  <span>{Variables.Icons.run}</span>
                  <input type="number" className="border" placeholder="Distance" value={exercise.distance} onChange={(e) => handleExerciseChange(partIdx, 'distance', e.target.value)} />
                  <input type="number" className="border" placeholder="Min Reps" value={exercise.minReps} onChange={(e) => handleRepsChange(partIdx, 'minReps', e.target.value)} />
                  <input type="number" className="border" placeholder="Max Reps" value={exercise.maxReps} onChange={(e) => handleRepsChange(partIdx, 'maxReps', e.target.value)} />
                </div>
              )
              :
              exercise.type === ExerciseType.Strength ? (
                <div>
                  <span>{Variables.Icons.strength}</span>
                  <input type="text" className="border" placeholder="Description" value={exercise.description} onChange={(e) => handleExerciseChange(partIdx, 'description', e.target.value)} />
                  <input type="number" className="border" placeholder="Min Reps" value={exercise.minReps} onChange={(e) => handleRepsChange(partIdx, 'minReps', e.target.value)} />
                  <input type="number" className="border" placeholder="Max Reps" value={exercise.maxReps} onChange={(e) => handleRepsChange(partIdx, 'maxReps', e.target.value)} />
                </div>
              )
              :
              (
                <div>
                  <span>{Variables.Icons.rest}</span>
                  <input type="number" className="border" placeholder="Min Rest" value={exercise.minReps} onChange={(e) => handleRestChange(partIdx, 'minReps', 'seconds', e.target.value)} />
                  <input type="number" className="border" placeholder="Max Rest" value={exercise.maxReps} onChange={(e) => handleRestChange(partIdx, 'maxReps', 'seconds', e.target.value)} />
                </div>
              )
            }
          </div>
          <TextButton text="Remove Exercise" onClick={() => handleExerciseRemoval(partIdx)}/>
        </div>
      ))}
    </>
  );

}

export default ExerciseCreation;