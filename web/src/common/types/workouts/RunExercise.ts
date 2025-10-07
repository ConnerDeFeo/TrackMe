import { ExerciseType } from "../../constants/Enums";
import type { ExerciseBase } from "./ExerciseBase";

export interface RunExercise extends ExerciseBase{
  type: ExerciseType.Run;
  distance: number;
  measurement: string;
}