import type { Exercise } from "./Exercise";

export type Workout = {
    workoutId?: string;
    groupWorkoutId?: string;
    title: string;
    description?: string;
    sections: Array<Exercise>;
}