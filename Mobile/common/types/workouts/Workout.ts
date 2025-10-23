import { Exercise } from "./Exercise";
import Section from "./Section";

type Workout = {
    workoutId?: string;
    groupWorkoutId?: string;
    title: string;
    description?: string;
    sections: Array<Section>;
}

export default Workout;