import { useState } from "react";
import { ExerciseType } from "../../constants/Enums";
import { Variables } from "../../constants/Variables";
import type { Exercise } from "../../types/workouts/Exercise";
import type { Rest } from "../../types/workouts/Rest";
import type { Section } from "../../types/workouts/Section";

// Component for creating/editing a list of exercises within a section
const ExerciseCreation = ({
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

  // Toggle the visibility of the notes textarea for a given exercise
  const toggleNotes = (partIdx: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partIdx)) {
        newSet.delete(partIdx);
      } else {
        newSet.add(partIdx);
      }
      return newSet;
    });
  };

  /**
   * Generic handler to update any field of an exercise
   * at index `partIdx`. Updates the parent sections state.
   */
  const handleExerciseChange = (
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
  };

  /**
   * Specialized handler for rest durations.
   * Converts minutes/seconds inputs to total seconds.
   */
  const handleRestChange = (
    partIdx: number,
    field: 'minReps' | 'maxReps',
    unit: 'minutes' | 'seconds',
    value: string
  ) => {
    const numericValue = value ? parseInt(value) : 0;
    if (isNaN(numericValue)) return;

    const currentExercise = exercises[partIdx] as Rest;
    const currentDuration = currentExercise[field] || 0;
    const currentMinutes = Math.floor(currentDuration / 60);
    const currentSeconds = currentDuration % 60;

    let newDuration = 0;
    if (unit === 'minutes') {
      newDuration = numericValue * 60 + currentSeconds;
    } else {
      newDuration = currentMinutes * 60 + numericValue;
    }

    handleExerciseChange(partIdx, field, newDuration);
  };

  // Handler for updating numeric reps fields (min/max)
  const handleRepsChange = (
    partIdx: number,
    field: 'minReps' | 'maxReps',
    value: string
  ) => {
    const numericValue = value ? parseInt(value) : undefined;
    if (value && isNaN(numericValue!)) return;
    handleExerciseChange(partIdx, field, numericValue);
  };

  return (
    <div className="space-y-2">
      {exercises.map((exercise, partIdx) => (
        <div
          key={partIdx}
          className="bg-gray-50 rounded-lg border border-gray-200"
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
            {exercise.type === ExerciseType.Run ? (
              <>
                {/* Distance input for running */}
                <input
                  type="number"
                  value={exercise.distance || ''}
                  onChange={e =>
                    handleExerciseChange(
                      partIdx,
                      'distance',
                      e.target.value
                    )
                  }
                  placeholder="Distance"
                  className="w-28 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
                />
                <span className="text-xs text-gray-500 flex-shrink-0">
                  meters
                </span>
                <span className="text-gray-300 flex-shrink-0">|</span>
                <span className="text-xs text-gray-600 font-medium flex-shrink-0">
                  Reps:
                </span>
                {/* Reps range inputs */}
                <input
                  type="number"
                  value={exercise.minReps || ''}
                  onChange={e =>
                    handleRepsChange(partIdx, 'minReps', e.target.value)
                  }
                  placeholder="Min"
                  className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
                />
                <span className="text-gray-400 flex-shrink-0">-</span>
                <input
                  type="number"
                  value={exercise.maxReps || ''}
                  onChange={e =>
                    handleRepsChange(partIdx, 'maxReps', e.target.value)
                  }
                  placeholder="Max"
                  className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
                />
              </>
            ) : exercise.type === ExerciseType.Strength ? (
              <>
                {/* Description input for strength exercises */}
                <input
                  type="text"
                  value={exercise.description || ''}
                  onChange={e =>
                    handleExerciseChange(
                      partIdx,
                      'description',
                      e.target.value
                    )
                  }
                  placeholder="Exercise description..."
                  className="flex-1 min-w-0 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
                />
                <span className="text-gray-300 flex-shrink-0">|</span>
                <span className="text-xs text-gray-600 font-medium flex-shrink-0">
                  Reps:
                </span>
                {/* Reps range for strength */}
                <input
                  type="number"
                  value={exercise.minReps || ''}
                  onChange={e =>
                    handleRepsChange(partIdx, 'minReps', e.target.value)
                  }
                  placeholder="Min"
                  className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
                />
                <span className="text-gray-400 flex-shrink-0">-</span>
                <input
                  type="number"
                  value={exercise.maxReps || ''}
                  onChange={e =>
                    handleRepsChange(partIdx, 'maxReps', e.target.value)
                  }
                  placeholder="Max"
                  className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
                />
              </>
            ) : (
              <>
                {/* Inputs for rest periods */}
                <span className="text-xs text-gray-600 font-medium flex-shrink-0">
                  Rest:
                </span>
                <input
                  type="number"
                  value={exercise.minReps || ''}
                  onChange={e =>
                    handleRestChange(
                      partIdx,
                      'minReps',
                      'seconds',
                      e.target.value
                    )
                  }
                  placeholder="Min"
                  className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
                />
                <span className="text-gray-400 flex-shrink-0">-</span>
                <input
                  type="number"
                  value={exercise.maxReps || ''}
                  onChange={e =>
                    handleRestChange(
                      partIdx,
                      'maxReps',
                      'seconds',
                      e.target.value
                    )
                  }
                  placeholder="Max"
                  className="w-20 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-trackme-blue"
                />
                <span className="text-xs text-gray-500 flex-shrink-0">
                  seconds
                </span>
              </>
            )}

            {/* Button to toggle notes textarea */}
            <button
              onClick={() => toggleNotes(partIdx)}
              className={`ml-auto flex-shrink-0 px-2 py-1 text-xs rounded transition-all ${
                expandedNotes.has(partIdx) || exercise.notes
                  ? 'text-trackme-blue bg-blue-50 hover:bg-blue-100'
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
      ))}
    </div>
  );
};

export default ExerciseCreation;