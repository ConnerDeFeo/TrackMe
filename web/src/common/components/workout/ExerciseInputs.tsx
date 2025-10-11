import { useCallback } from "react";
import { ExerciseType } from "../../constants/Enums";
import RunExerciseInputs from "./RunExerciseInputs";
import type { Rest } from "../../types/workouts/Rest";
import RestExerciseInputs from "./RestExerciseInputs";
import type { Exercise } from "../../types/workouts/Exercise";
import StrengthExerciseInputs from "./StrengthExerciseINputs";

const ExerciseInputs = ({exercise, partIdx, exercises, handleExerciseChange}:
    {exercise: Exercise, partIdx: number, exercises: Exercise[], handleExerciseChange: (index: number, field: string, value: string | number | undefined) => void}
)=>{
    /**
       * Specialized handler for rest durations.
       * Converts minutes/seconds inputs to total seconds.
       */
      const handleRestChange = useCallback((
        partIdx: number,
        field: 'minReps' | 'maxReps',
        unit: 'minutes' | 'seconds',
        value: string
      ) => {
        const numericValue = value ? parseInt(value) : 0;
        if (isNaN(numericValue)) return;
    
        const currentExercise = exercises[partIdx] as Rest;
        const currentDuration = currentExercise[field] || 0;
        const currentMinutes = Math.floor(currentDuration / 60);
        const currentSeconds = currentDuration % 60;
    
        let newDuration = 0;
        if (unit === 'minutes') {
          newDuration = numericValue * 60 + currentSeconds;
        } else {
          newDuration = currentMinutes * 60 + numericValue;
        }
    
        handleExerciseChange(partIdx, field, newDuration);
      }, [exercises, handleExerciseChange]);
    
      // Handler for updating numeric reps fields (min/max)
      const handleRepsChange = useCallback((
        partIdx: number,
        field: 'minReps' | 'maxReps',
        value: string
      ) => {
        const numericValue = value ? parseInt(value) : undefined;
        if (value && isNaN(numericValue!)) return;
        handleExerciseChange(partIdx, field, numericValue);
      }, [exercises, handleExerciseChange]);

    return(
        exercise.type === ExerciseType.Run ? (
            <RunExerciseInputs
                exercise={exercise}
                partIdx={partIdx}
                handleExerciseChange={handleExerciseChange}
                handleRepsChange={handleRepsChange}
            />
            ) 
            : 
            exercise.type === ExerciseType.Strength ? (
            <StrengthExerciseInputs
                exercise={exercise}
                partIdx={partIdx}
                handleExerciseChange={handleExerciseChange}
                handleRepsChange={handleRepsChange}
            />
            ) 
            : 
            (
            <RestExerciseInputs
                exercise={exercise}
                partIdx={partIdx}
                handleRestChange={handleRestChange}
            />
            )
    );
}

export default ExerciseInputs;