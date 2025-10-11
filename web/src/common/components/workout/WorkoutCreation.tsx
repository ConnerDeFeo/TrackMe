import { useEffect, useState } from "react";
import type { Workout } from "../../types/workouts/Workout";
import SectionCreation from "./SectionCreation";
import type { Section } from "../../types/workouts/Section";
import TrackmeButton from "../TrackmeButton";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { HandleMouseDownDragAndDrop } from "../../functions/HandleMouseDownDragAndDrop";
import AiGenerationTextBox from "../display/AiGenerationTextBox";
import Modal from "../Modal";
import SectionTemplatesPreview from "../display/SectionTemplatesPreview";

// Define props for clarity
type WorkoutCreationProps = {
    workout?: Workout,
    handleWorkoutCreation: (workout: Workout) => void,
    handleCancel?: () => void
    sectionsPreview?: { id: string; name: string }[]
}

const WorkoutCreation = ({
    workout,
    handleWorkoutCreation,
    handleCancel,
    sectionsPreview
}: WorkoutCreationProps) => {
    // Local state for workout fields
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [sections, setSections] = useState<Section[]>([]);
    const [aiWorkoutPrompt, setAiWorkoutPrompt] = useState<string>("");
    const [importSectionTemplateMode, setImportSectionTemplateMode] = useState(false);

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

    const handleImportTemplateSelection = async (sectionId: string) => {
        const resp = await CoachWorkoutService.getSectionTemplate(sectionId);
        if(resp.ok){
            const data = await resp.json();
            setSections(prev => [...prev, data]);
            setImportSectionTemplateMode(false);
        }
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
                <div key={idx}>
                    <SectionCreation
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
                </div>
            ))}

            {/* Button to add a new empty section */}
            <div className="flex flex-row justify-between">
                <TrackmeButton className="w-[48%]" onClick={() => setImportSectionTemplateMode(true)}>
                    Import Section Template
                </TrackmeButton>
                <TrackmeButton
                    onClick={() =>
                        setSections(prev => [...prev, { name: "", minSets: 1 }])
                    }
                    className="w-[48%]"
                >
                    Add Section
                </TrackmeButton>
            </div>

            {
                importSectionTemplateMode &&
                <Modal onClose={() => setImportSectionTemplateMode(false)}>
                    <h2 className="text-lg font-semibold mb-4 border-b trackme-border-gray py-2">Select a Section Template</h2>
                    <SectionTemplatesPreview
                        sectionPreviews={sectionsPreview || []}
                        handleSectionSelection={handleImportTemplateSelection}
                    />
                </Modal>
            }

            {/* AI Workout Generation Prompt */}
            <AiGenerationTextBox
                aiWorkoutPrompt={aiWorkoutPrompt}
                setAiWorkoutPrompt={setAiWorkoutPrompt}
                handleAiWorkoutGeneration={handleAiWorkoutGeneration}
            />

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