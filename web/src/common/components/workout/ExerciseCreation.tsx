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
    <></>
  );

}

export default ExerciseCreation;