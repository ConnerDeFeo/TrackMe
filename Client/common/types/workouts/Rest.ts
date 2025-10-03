import { ExerciseType } from "../../constants/Enums";
import { ExerciseBase } from "./ExerciseBase";

export interface Rest extends ExerciseBase {
  type: ExerciseType.Rest;
}