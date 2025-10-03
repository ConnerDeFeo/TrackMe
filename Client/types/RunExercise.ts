import { ExerciseType } from "../assets/constants/Enums";
import { ExerciseBase } from "./ExerciseBase";

export interface RunExercise extends ExerciseBase{
  type: ExerciseType.Run;
  distance: number;
  measurement: string;
}