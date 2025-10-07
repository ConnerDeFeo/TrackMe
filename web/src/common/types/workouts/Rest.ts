import { ExerciseType } from "../../constants/Enums";
import type { ExerciseBase } from "./ExerciseBase";

export interface Rest extends ExerciseBase {
  type: ExerciseType.Rest;
}