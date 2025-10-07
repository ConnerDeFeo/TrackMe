import { ExerciseType } from "../../constants/Enums";
import Variables from "../../constants/Variables";
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
    return (
        <div>
          {section.exercises && section.exercises.length > 0 && (
            <ExerciseCreation
              exercises={section.exercises}
              handleExerciseRemoval={handleExerciseRemoval}
              setSections={setSections}
              idx={idx}
            />
          )}
        </div>
    );
}

export default SectionCreation;