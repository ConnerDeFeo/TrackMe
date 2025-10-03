import { ExerciseType } from "../assets/constants/Enums";

export interface ExerciseBase {
    minReps?: number;
    maxReps?: number;
    type: ExerciseType;
}