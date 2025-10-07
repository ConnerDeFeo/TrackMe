import type { ExerciseType } from "../../constants/Enums";

export interface ExerciseBase {
    minReps?: number;
    maxReps?: number;
    type: ExerciseType;
}