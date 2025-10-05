import { ExerciseType } from "../../constants/Enums";
import { ExerciseBase } from "./ExerciseBase";

export interface StrengthExercise extends ExerciseBase{
  type: ExerciseType.Strength;
  description: string;
}