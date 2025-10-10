import { useEffect, useState } from "react";
import type { Workout } from "../../types/workouts/Workout";
import SectionCreation from "./SectionCreation";
import type { Section } from "../../types/workouts/Section";
import TrackmeButton from "../TrackmeButton";
import CoachWorkoutService from "../../../services/CoachWorkoutService";

const WorkoutCreation = ({ workout, handleWorkoutCreation, handleCancel }:{ workout?: Workout, handleWorkoutCreation: (workout: Workout) => void, handleCancel?: () => void }) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [sections, setSections] = useState<Section[]>([]);
    const [aiWorkoutPrompt, setAiWorkoutPrompt] = useState<string>('');

    useEffect(() => {
        if (workout) {
            setTitle(workout.title);
            setDescription(workout.description || '');
            setSections(workout.sections || []);
        }
    }, [workout]);

    const handleAiWorkoutGeneration = async () => {
        const resp = await CoachWorkoutService.bedrockWorkoutGeneration(aiWorkoutPrompt, workout);
        if (resp.ok) {
            const data = await resp.json();
            if(data){
                setTitle(data.title || '');
                setDescription(data.description || '');
                setSections(data.sections || []);
            }
        }
    }

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
            <div className="relative">
                <textarea
                    value={aiWorkoutPrompt}
                    onChange={(e) => {
                        setAiWorkoutPrompt(e.target.value);
                        // reset height to auto to recalculate scrollHeight
                        e.target.style.height = 'auto';
                        // cap the height at 200px, after that it will scroll
                        const newHeight = Math.min(e.target.scrollHeight, 200);
                        e.target.style.height = `${newHeight}px`;
                    }}
                    className="border trackme-border-gray rounded w-full p-4 my-4 pr-12 resize-none overflow-y-auto max-h-[200px] break-words"
                    placeholder="AI Workout Generation"
                    onKeyDown={e => {if (e.key==="Enter"){handleAiWorkoutGeneration();}}}
                />
                <div className="absolute right-4 bottom-10">
                    { aiWorkoutPrompt === "" ?
                        <img
                            alt="AI Workout Generation"
                            src="/assets/images/Sparkle.png"
                            className="h-10 w-10"
                        />
                        :
                        <img
                            alt="AI Workout Generation"
                            src="/assets/images/ArrowUp.png"
                            className="h-10 w-10 cursor-pointer"
                            onClick={handleAiWorkoutGeneration}
                        />
                    }
                </div>
            </div>
            <div className="flex gap-x-3">
                <TrackmeButton onClick={handleCancel} className="w-full" gray>
                    Cancel
                </TrackmeButton>
                <TrackmeButton onClick={() => handleWorkoutCreation({ title, description, sections, workoutId: workout?.workoutId, groupWorkoutId: workout?.groupWorkoutId })} className="w-full">
                    Save Workout
                </TrackmeButton>
            </div>
        </>
    );
}

export default WorkoutCreation;