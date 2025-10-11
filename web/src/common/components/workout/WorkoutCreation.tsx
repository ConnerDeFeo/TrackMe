import { useEffect, useState } from "react";
import type { Workout } from "../../types/workouts/Workout";
import SectionCreation from "./SectionCreation";
import type { Section } from "../../types/workouts/Section";
import TrackmeButton from "../TrackmeButton";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { HandleMouseDownDragAndDrop } from "../../functions/HandleMouseDownDragAndDrop";

// Define props for clarity
type WorkoutCreationProps = {
    workout?: Workout
    handleWorkoutCreation: (workout: Workout) => void
    handleCancel?: () => void
}

const WorkoutCreation = ({
    workout,
    handleWorkoutCreation,
    handleCancel
}: WorkoutCreationProps) => {
    // Local state for workout fields
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [sections, setSections] = useState<Section[]>([]);
    const [aiWorkoutPrompt, setAiWorkoutPrompt] = useState<string>("");

    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    // Populate fields if an existing workout is passed in
    useEffect(() => {
        if (!workout) return
        setTitle(workout.title)
        setDescription(workout.description || "")
        setSections(workout.sections || [])
    }, [workout])

    // Trigger AI generation and update form with returned data
    const handleAiWorkoutGeneration = async () => {
        const resp = await CoachWorkoutService.bedrockWorkoutGeneration(
            aiWorkoutPrompt,
            workout
        )
        if (!resp.ok) return

        const data = await resp.json()
        if (!data) return

        setTitle(data.title || "")
        setDescription(data.description || "")
        setSections(data.sections || [])
    }

  // Mouse enter over an item during drag will reorder the exercises
  const handleMouseEnter = (index: number) => {
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      const updatedSections = [...sections];
      const [draggedItem] = updatedSections.splice(draggedItemIndex, 1);
      updatedSections.splice(index, 0, draggedItem);

      // Update the section order
      setDraggedItemIndex(index);
      setSections(updatedSections);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    const target = e.target as HTMLElement;
    if (["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName) || target.closest('[data-nodrag]')) {
        return;
    }
    HandleMouseDownDragAndDrop(e, index, setDraggedItemIndex, setDragPosition);
  }
    return (
        <>
            {/* Workout Title Input */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Workout Title
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter workout title..."
                    className="w-full px-4 py-3 text-lg font-medium border-2 border-gray-200 rounded-xl
                                         focus:outline-none focus:border-trackme-blue focus:ring-2 focus:ring-blue-100
                                         transition-all"
                />
            </div>

            {/* Workout Description Input */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe this workout..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl
                                         focus:outline-none focus:border-trackme-blue focus:ring-2 focus:ring-blue-100
                                         transition-all resize-none"
                />
            </div>

            {/* Existing Sections */}
            {sections.map((section, idx) => (
                <>
                    <SectionCreation
                        key={idx}
                        section={section}
                        setSections={setSections}
                        idx={idx}
                        handleMouseDown={handleMouseDown}
                        handleMouseEnter={handleMouseEnter}
                        className={`${draggedItemIndex === idx ? "opacity-50" : ""}`}
                    />
                    {/* Drag preview overlay */}
                    {draggedItemIndex === idx && (
                        <div
                            className="fixed pointer-events-none z-50"
                            style={{ top: dragPosition.y, left: dragPosition.x }}
                        >
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg">
                                {section.name || "Section"}
                            </div>
                        </div>
                    )}
                </>
            ))}

            {/* Button to add a new empty section */}
            <TrackmeButton
                className="mt-3 w-full"
                onClick={() =>
                    setSections(prev => [...prev, { name: "", minSets: 1 }])
                }
            >
                Add Section
            </TrackmeButton>

            {/* AI Workout Generation Prompt */}
            <div className="relative my-4">
                <textarea
                    value={aiWorkoutPrompt}
                    onChange={e => {
                        setAiWorkoutPrompt(e.target.value)
                        // Auto-resize but cap at 200px height
                        e.target.style.height = "auto"
                        e.target.style.height = `${Math.min(
                            e.target.scrollHeight,
                            200
                        )}px`
                    }}
                    placeholder="AI Workout Generation prompt..."
                    className="w-full p-4 pr-12 border trackme-border-gray rounded resize-none
                                         overflow-y-auto max-h-[200px] break-words"
                    onKeyDown={e => {
                        if (e.key === "Enter") handleAiWorkoutGeneration()
                    }}
                />

                {/* Trigger icon for AI request */}
                <div className="absolute right-4 bottom-10">
                    {aiWorkoutPrompt === "" ? (
                        <img
                            src="/assets/images/Sparkle.png"
                            alt="Enter prompt to generate"
                            className="h-10 w-10"
                        />
                    ) : (
                        <img
                            src="/assets/images/ArrowUp.png"
                            alt="Generate AI workout"
                            className="h-10 w-10 cursor-pointer"
                            onClick={handleAiWorkoutGeneration}
                        />
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-x-3">
                <TrackmeButton onClick={handleCancel} className="w-full" gray>
                    Cancel
                </TrackmeButton>
                <TrackmeButton
                    onClick={() =>
                        handleWorkoutCreation({
                            title,
                            description,
                            sections,
                            workoutId: workout?.workoutId,
                            groupWorkoutId: workout?.groupWorkoutId
                        })
                    }
                    className="w-full"
                >
                    Save Workout
                </TrackmeButton>
            </div>
        </>
    )
}

export default WorkoutCreation