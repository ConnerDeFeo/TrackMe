import { useState } from "react";
import type { Workout } from "../../types/workouts/Workout";
import SectionCreation from "./SectionCreation";
import type { Section } from "../../types/workouts/Section";

const WorkoutCreation = ({workout}:{workout?: Workout}) => {
    const [title, setTitle] = useState<string>(workout ? workout.title : '');
    const [description, setDescription] = useState<string>(workout ? workout.description || '' : '');
    const [sections, setSections] = useState<Section[]>(workout?.sections || []);

    return(
        <div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded mb-4 w-full"/>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded mb-4 w-full"/>
            {/* Sections and exercises editing would go here */}
            {sections.map((section, index) => (
                <SectionCreation key={index} section={section} setSections={setSections} idx={index} />
            ))}
        </div>
    );
}

export default WorkoutCreation;