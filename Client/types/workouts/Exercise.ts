import { Rest } from "./Rest";
import { RunExercise } from "./RunExercise";
import { StrengthExercise } from "./StrengthExercise";

export type Exercise = Rest | RunExercise | StrengthExercise;