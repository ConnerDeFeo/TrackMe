import { ExerciseType } from "../assets/constants/Enums";

export interface ExerciseBase {
    reps?: number;
    type: ExerciseType;
}