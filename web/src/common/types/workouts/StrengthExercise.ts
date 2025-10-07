import { ExerciseType } from "../../constants/Enums";
import type { ExerciseBase } from "./ExerciseBase";

export interface StrengthExercise extends ExerciseBase{
  type: ExerciseType.Strength;
  description: string;
}