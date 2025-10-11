import { useCallback, useState } from "react";
import { ExerciseType } from "../../constants/Enums";
import { Variables } from "../../constants/Variables";
import type { Exercise } from "../../types/workouts/Exercise";
import type { Section } from "../../types/workouts/Section";
import ExerciseInputs from "./ExerciseInputs";

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
  // Track which exercise notes panels are expanded
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    const tag = (e.target as HTMLElement).tagName;
    if (["INPUT", "TEXTAREA", "BUTTON"].includes(tag)) return;
    e.preventDefault();
    setDraggedItemIndex(index);
    setDragPosition({ x: e.clientX, y: e.clientY });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setDragPosition({ x: moveEvent.clientX, y: moveEvent.clientY });
    }

    const handleMouseUp = () => {
      setDraggedItemIndex(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseEnter = (index: number) => {
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      const updatedExercises = [...exercises];
      const [draggedItem] = updatedExercises.splice(draggedItemIndex, 1);
      updatedExercises.splice(index, 0, draggedItem);
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

  // Toggle the visibility of the notes textarea for a given exercise
  const toggleNotes = useCallback((partIdx: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partIdx)) newSet.delete(partIdx);
      else newSet.add(partIdx);
      return newSet;
    });
  }, []);

  /**
   * Generic handler to update any field of an exercise
   * at index `partIdx`. Updates the parent sections state.
   */
  const handleExerciseChange = useCallback((
    partIdx: number,
    field: string,
    value: any
  ) => {
    const updatedExercises = [...exercises];
    (updatedExercises[partIdx] as any)[field] = value;

    // Replace the exercises array in the corresponding section
    setSections(prevSections =>
      prevSections.map((section, sectionIdx) =>
        sectionIdx === idx
          ? { ...section, exercises: updatedExercises }
          : section
      )
    );
  }, [exercises, idx, setSections]);

  return (
    <div className="space-y-2" onDragEnd={() => setDraggedItemIndex(null)}>
      {exercises.map((exercise, partIdx) => {
        return (
          <>
            <div
              key={partIdx}
              className="bg-gray-50 rounded-lg border border-gray-200 cursor-move opacity-100"
              onMouseDown={e=>handleMouseDown(e,partIdx)}
              onMouseEnter={() => handleMouseEnter(partIdx)}
            >
              {/* Header row: icon, inputs, notes & remove buttons */}
              <div className="flex items-center gap-3 p-2">
                {/* Icon indicating exercise type */}
                <span className="text-lg flex-shrink-0">
                  {exercise.type === ExerciseType.Run
                    ? Variables.Icons.run
                    : exercise.type === ExerciseType.Strength
                    ? Variables.Icons.strength
                    : Variables.Icons.rest}
                </span>

                {/* Conditional input fields based on exercise.type */}
                <ExerciseInputs
                  exercise={exercise}
                  partIdx={partIdx}
                  exercises={exercises}
                  handleExerciseChange={handleExerciseChange}
                />

                {/* Button to toggle notes textarea */}
                <button
                  onClick={() => toggleNotes(partIdx)}
                  className={`ml-auto flex-shrink-0 px-2 py-1 text-xs rounded transition-all ${
                    expandedNotes.has(partIdx) || exercise.notes
                      ? 'text-trackme-blue bg-blue-100 hover:bg-blue-300'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Add notes"
                >
                  {Variables.Icons.notes}
                </button>

                {/* Remove this exercise from the list */}
                <button
                  onClick={() => handleExerciseRemoval(partIdx)}
                  className="flex-shrink-0 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-all"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              {/* Expandable notes section */}
              {expandedNotes.has(partIdx) && (
                <div className="px-2 pb-2">
                  <textarea
                    value={exercise.notes || ''}
                    onChange={e =>
                      handleExerciseChange(partIdx, 'notes', e.target.value)
                    }
                    placeholder="Add notes for this exercise..."
                    rows={2}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-trackme-blue resize-none"
                  />
                </div>
              )}
            </div>

            {draggedItemIndex === partIdx && (
              <div
                className="fixed pointer-events-none z-50"
                style={{ top: dragPosition.y, left: dragPosition.x }}
              >
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg">
                  {exercise.type === ExerciseType.Run
                    ? 
                    (
                      <div className="flex items-center gap-2">
                        {Variables.Icons.run} {exercise.minReps ? exercise.minReps : 0} {exercise.maxReps ? `- ${exercise.maxReps}` : ''} x {exercise.distance}m
                      </div>
                    )
                    : exercise.type === ExerciseType.Strength
                    ? 
                    (
                      <div className="flex items-center gap-2">
                        {Variables.Icons.strength} {exercise.minReps ? exercise.minReps : 0} {exercise.maxReps ? `- ${exercise.maxReps}` : ''} x {exercise.description}
                      </div>
                    )
                    : 
                    (
                      <div className="flex items-center gap-2">
                        {Variables.Icons.strength} {exercise.minReps ? exercise.minReps : 0}s {exercise.maxReps ? `- ${exercise.maxReps}s` : ''}
                      </div>
                    )}
                    
                </div>
              </div>
            )}
          </>
        )
      }
      )}
    </div>
  );
};

export default ExercisesCreation;