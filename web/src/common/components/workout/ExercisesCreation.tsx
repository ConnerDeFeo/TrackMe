import { useCallback, useState } from "react";
import { ExerciseType } from "../../constants/Enums";
import { Variables } from "../../constants/Variables";
import type { Exercise } from "../../types/workouts/Exercise";
import type { Section } from "../../types/workouts/Section";
import ExerciseInputs from "./ExerciseInputs";

// Component for creating/editing a list of exercises within a section
// Component for creating/editing a list of exercises within a section
const ExercisesCreation = ({
  exercises,
  handleExerciseRemoval,
  setSections,
  idx,
}: {
  exercises: Exercise[];
  handleExerciseRemoval: (partIdx: number) => void;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  idx: number;
}) => {
  // State: which notes panels are expanded (by exercise index)
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  // State: index of the item currently being dragged (or null if none)
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // State: current mouse position for rendering the drag preview
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  // Mouse down begins drag operation (unless clicking on input/button)
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    const tag = (e.target as HTMLElement).tagName;
    if (["INPUT", "TEXTAREA", "BUTTON"].includes(tag)) return; // ignore form elements
    e.preventDefault();

    // Initialize drag
    setDraggedItemIndex(index);
    setDragPosition({ x: e.clientX, y: e.clientY });

    // Update drag position on move
    const handleMouseMove = (moveEvent: MouseEvent) => {
      setDragPosition({ x: moveEvent.clientX, y: moveEvent.clientY });
    };

    // End drag on mouse up and clean up listeners
    const handleMouseUp = () => {
      setDraggedItemIndex(null);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Mouse enter over an item during drag will reorder the exercises
  const handleMouseEnter = (index: number) => {
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      const updatedExercises = [...exercises];
      const [draggedItem] = updatedExercises.splice(draggedItemIndex, 1);
      updatedExercises.splice(index, 0, draggedItem);

      // Update dragged index and bubble new order to parent sections
      setDraggedItemIndex(index);
      setSections(prevSections =>
        prevSections.map((section, sectionIdx) =>
          sectionIdx === idx
            ? { ...section, exercises: updatedExercises }
            : section
        )
      );
    }
  };

  // Toggle display of notes textarea for a given exercise
  const toggleNotes = useCallback((partIdx: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partIdx)) newSet.delete(partIdx);
      else newSet.add(partIdx);
      return newSet;
    });
  }, []);

  // Generic handler to update any exercise field (minReps, maxReps, notes, etc)
  const handleExerciseChange = useCallback(
    (partIdx: number, field: string, value: any) => {
      const updatedExercises = [...exercises];
      (updatedExercises[partIdx] as any)[field] = value;

      // Propagate changes up to sections array
      setSections(prevSections =>
        prevSections.map((section, sectionIdx) =>
          sectionIdx === idx
            ? { ...section, exercises: updatedExercises }
            : section
        )
      );
    },
    [exercises, idx, setSections]
  );

  return (
    <div
      className="space-y-2"
      // Ensure drag state resets if drag ends unexpectedly
      onDragEnd={() => setDraggedItemIndex(null)}
    >
      {exercises.map((exercise, partIdx) => (
        <div key={partIdx}>
          {/* Draggable exercise card */}
          <div
            className={`bg-gray-50 rounded-lg border border-gray-200 cursor-move ${
              draggedItemIndex === partIdx ? "opacity-50" : ""
            }`}
            onMouseDown={e => handleMouseDown(e, partIdx)}
            onMouseEnter={() => handleMouseEnter(partIdx)}
          >
            {/* Header row: icon, inputs, notes toggle, remove button */}
            <div className="flex items-center gap-3 p-2">
              {/* Icon indicating exercise type */}
              <span className="text-lg flex-shrink-0">
                {exercise.type === ExerciseType.Run
                  ? Variables.Icons.run
                  : exercise.type === ExerciseType.Strength
                  ? Variables.Icons.strength
                  : Variables.Icons.rest}
              </span>

              {/* Inputs for sets, reps, distance, etc. */}
              <ExerciseInputs
                exercise={exercise}
                partIdx={partIdx}
                exercises={exercises}
                handleExerciseChange={handleExerciseChange}
              />

              {/* Toggle notes panel */}
              <button
                onClick={() => toggleNotes(partIdx)}
                className={`ml-auto flex-shrink-0 px-2 py-1 text-xs rounded transition-all ${
                  expandedNotes.has(partIdx) || exercise.notes
                    ? "text-trackme-blue bg-blue-100 hover:bg-blue-300"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                title="Add notes"
              >
                {Variables.Icons.notes}
              </button>

              {/* Remove exercise button */}
              <button
                onClick={() => handleExerciseRemoval(partIdx)}
                className="flex-shrink-0 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-all"
                title="Remove"
              >
                ✕
              </button>
            </div>

            {/* Expandable notes textarea */}
            {expandedNotes.has(partIdx) && (
              <div className="px-2 pb-2">
                <textarea
                  value={exercise.notes || ""}
                  onChange={e =>
                    handleExerciseChange(partIdx, "notes", e.target.value)
                  }
                  placeholder="Add notes for this exercise..."
                  rows={2}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-trackme-blue resize-none"
                />
              </div>
            )}
          </div>

          {/* Drag preview overlay */}
          {draggedItemIndex === partIdx && (
            <div
              className="fixed pointer-events-none z-50"
              style={{ top: dragPosition.y, left: dragPosition.x }}
            >
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg">
                {/* Show a compact summary of the dragged exercise */}
                {exercise.type === ExerciseType.Run ? (
                  <div className="flex items-center gap-2">
                    {Variables.Icons.run}{" "}
                    {exercise.minReps ?? 0}{" "}
                    {exercise.maxReps ? `- ${exercise.maxReps}` : ""} x{" "}
                    {exercise.distance}m
                  </div>
                ) : exercise.type === ExerciseType.Strength ? (
                  <div className="flex items-center gap-2">
                    {Variables.Icons.strength}{" "}
                    {exercise.minReps ?? 0}{" "}
                    {exercise.maxReps ? `- ${exercise.maxReps}` : ""} x{" "}
                    {exercise.description}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {Variables.Icons.strength}{" "}
                    {exercise.minReps ?? 0}s{" "}
                    {exercise.maxReps ? `- ${exercise.maxReps}s` : ""}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExercisesCreation;