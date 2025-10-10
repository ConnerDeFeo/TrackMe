import type { Section } from "./Section";

export type Workout = {
    workoutId?: string;
    groupWorkoutId?: string;
    title: string;
    description?: string;
    sections?: Array<Section>;
}