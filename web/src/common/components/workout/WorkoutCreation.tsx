import { useState } from "react";
import type { Workout } from "../../types/workouts/Workout";
import SectionCreation from "./SectionCreation";
import type { Section } from "../../types/workouts/Section";
import TrackmeButton from "../TrackmeButton";

const WorkoutCreation = ({ workout, handleWorkoutCreation, handleCancel }:{ workout?: Workout, handleWorkoutCreation: (workout: Workout) => void, handleCancel?: () => void }) => {
    const [title, setTitle] = useState<string>(workout ? workout.title : '');
    const [description, setDescription] = useState<string>(workout ? workout.description || '' : '');
    const [sections, setSections] = useState<Section[]>(workout?.sections || []);

    return(
        <>
            {/* Title Input */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Workout Title
                </label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter workout title..."
                    className="w-full px-4 py-3 text-lg font-medium border-2 border-gray-200 rounded-xl focus:outline-none focus:border-trackme-blue focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>

            {/* Description Input */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                </label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Describe this workout..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-trackme-blue focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
            </div>

            {/* Sections and exercises editing would go here */}
            {sections.map((section, index) => (
                <SectionCreation key={index} section={section} setSections={setSections} idx={index} />
            ))}
            <TrackmeButton className="mt-3 w-full" onClick={() => setSections((prev) => [...prev, { name: '', minSets: 1 }])}>
                Add Section
            </TrackmeButton>
            <div className="flex gap-x-3 mt-6">
                <TrackmeButton onClick={handleCancel} className="w-full" gray>
                    Cancel
                </TrackmeButton>
                <TrackmeButton onClick={() => handleWorkoutCreation({ title, description, sections, workoutId: workout?.workoutId })} className="w-full">
                    Save Workout
                </TrackmeButton>
            </div>
        </>
    );
}

export default WorkoutCreation;