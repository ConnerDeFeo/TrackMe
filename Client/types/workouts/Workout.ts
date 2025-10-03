import { Exercise } from "./Exercise";

type Workout = {
    workoutId?: string;
    groupWorkoutId?: string;
    title: string;
    description?: string;
    sections: Array<Exercise>;
}

export default Workout;