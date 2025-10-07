import { useState } from "react";
import type { Workout } from "../types/workouts/Workout";

const WorkoutCreation = ({workout}:{workout?: Workout}) => {
    const [title, setTitle] = useState<string>(workout ? workout.title : '');
    const [description, setDescription] = useState<string>(workout ? workout.description || '' : '');
    const [sections, setSections] = useState(workout?.sections || []);

    return(
        <div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
    );
}