import { ExerciseType } from "../../constants/Enums";
import { Variables } from "../../constants/Variables";
import type { Exercise } from "../../types/workouts/Exercise";
import type { Section } from "../../types/workouts/Section";
import ExerciseCreation from "./ExerciseCreation";

const SectionCreation = ({section, setSections, idx}: {section: Section, setSections: React.Dispatch<React.SetStateAction<Section[]>>, idx: number}) => {
    /**
   * Handles adding a new exercise of a specific type to the current section.
   */
  const handleExerciseAddition = (type: ExerciseType) => {
    const exercises = section.exercises ? [...section.exercises] : [];

    let newExercise: Exercise;
    switch (type) {
      case ExerciseType.Run:
        newExercise = { type: ExerciseType.Run, distance: 0, measurement: Variables.meters };
        break;
      case ExerciseType.Strength:
        newExercise = { type: ExerciseType.Strength, description: '' };
        break;
      case ExerciseType.Rest:
        newExercise = { type: ExerciseType.Rest };
        break;
    }

    exercises.push(newExercise);
    
    setSections((prev) => prev.map((s, index) => 
      index === idx ? { ...s, exercises: exercises } : s
    ));
  };

  /**
   * Handles removing an exercise from the current section.
   */
  const handleExerciseRemoval = (partIdx: number) => {
    if (section.exercises) {
      const updatedExercises = [...section.exercises];
      updatedExercises.splice(partIdx, 1);
      setSections((prev) => prev.map((s, index) => 
        index === idx ? { ...s, exercises: updatedExercises } : s
      ));
    }
  };

  /**
   * Handles changes to the 'sets' input field.
   */
  const handleMinSetsChange = (value: string) => {
    const num = value ? parseInt(value, 10) : 0;
    if (!isNaN(num) && num <= 99) {
      setSections(prevSections =>
        prevSections.map((s, index) =>
          index === idx ? { ...s, minSets: num } : s
        )
      );
    }
  };

  const handleMaxSetsChange = (value: string) => {
    const num = value ? parseInt(value, 10) : 0;
    if (!isNaN(num) && num <= 99) {
      setSections(prevSections =>
        prevSections.map((s, index) =>
          index === idx ? { ...s, maxSets: num } : s
        )
      );
    }
  };

  /**
   * Handles changes to the section's name.
   */
  const handleNameChange = (text: string) => {
    setSections((prev) => prev.map((s, index) => (index === idx ? { ...s, name: text } : s)));
  };

  /**
   * Handles deleting the entire section.
   */
  const handleSectionDeletion = () => {
    setSections((prev) => prev.filter((_, index) => index !== idx));
  };

  const renderExerciseButton = (exerciseType: ExerciseType) =>{
    return (
      <button
        onClick={() => handleExerciseAddition(exerciseType)}
        className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all"
      >
        {Variables.Icons[exerciseType]} {exerciseType}
      </button>
    );
  }

  return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <input 
              type="text" 
              value={section.name} 
              onChange={(e) => handleNameChange(e.target.value)} 
              placeholder="Section name..."
              className="w-full px-3 py-2 text-base font-semibold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-trackme-blue focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          
          {/* Sets Input - Inline */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Sets:</label>
            <input 
              type="number" 
              value={section.minSets === 0 ? '' : section.minSets} 
              onChange={(e) => handleMinSetsChange(e.target.value)} 
              placeholder="Min"
              className="w-16 px-2 py-2 text-center border-2 border-gray-200 rounded-lg focus:outline-none focus:border-trackme-blue transition-all"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              value={section.maxSets || ''} 
              onChange={(e) => handleMaxSetsChange(e.target.value)} 
              placeholder="Max"
              className="w-16 px-2 py-2 text-center border-2 border-gray-200 rounded-lg focus:outline-none focus:border-trackme-blue transition-all"
            />
          </div>

          {/* Delete Button */}
          <button
            onClick={handleSectionDeletion}
            className="px-3 py-2 text-sm font-medium text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all"
            title="Delete Section"
          >
            {Variables.Icons.trash}
          </button>
        </div>

        {/* Exercises */}
        {section.exercises && section.exercises.length > 0 && (
          <div className="mb-4">
            <ExerciseCreation
              exercises={section.exercises}
              handleExerciseRemoval={handleExerciseRemoval}
              setSections={setSections}
              idx={idx}
            />
          </div>
        )}

        {/* Add Exercise Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          {renderExerciseButton(ExerciseType.Run)}
          {renderExerciseButton(ExerciseType.Strength)}
          {renderExerciseButton(ExerciseType.Rest)}
        </div>
      </div>
    );
}

export default SectionCreation;