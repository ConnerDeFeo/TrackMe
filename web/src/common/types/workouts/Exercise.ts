import type { Rest } from "./Rest";
import type { RunExercise } from "./RunExercise";
import type { StrengthExercise } from "./StrengthExercise";

export type Exercise = Rest | RunExercise | StrengthExercise;