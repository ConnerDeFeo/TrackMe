import ExercisePart from "./ExercisePart";


type Exercise = {
  id: number;
  name: string;
  sets?: number;
  reps?: number;
  exerciseParts?: ExercisePart[];
};

export default Exercise;
