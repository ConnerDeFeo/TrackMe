import ExercisePart from "./ExercisePart";


type Exercise = {
  name: string;
  sets?: number;
  reps?: number;
  exerciseParts?: ExercisePart[];
};

export default Exercise;
