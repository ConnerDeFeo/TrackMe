import { Text, TextInput, Pressable, View } from "react-native";
import Variables from "../../../assets/constants/Variables";
import ExerciseCreation from "./ExerciseCreation";
import Section from "../../../types/Section";
import { Exercise } from "../../../types/Exercise";
import { ExerciseType } from "../../../assets/constants/Enums";
import TextButton from "../../display/TextButton";

/**
 * Component for creating and editing a single exercise section within a workout.
 * @param {object} props - The component props.
 * @param {Section} props.section - The section object being created or edited.
 * @param {React.Dispatch<React.SetStateAction<Section[]>>} props.setSections - The state setter function for the list of sections.
 * @param {number} props.idx - The index of this section in the parent sections array.
 */
const SectionCreation = ({ section, setSections, idx }: 
  { section: Section; setSections: React.Dispatch<React.SetStateAction<Section[]>>; idx: number; }) => {
    // Available numbers for sets
    const setOptions = Array.from({ length: 20 }, (_, i) => ({
      label: `${i + 1}`,
      value: i + 1,
    }));
    const pickerStyle = {width: 100};

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
  const handleSetsChange = (value: string) => {
    const num = value ? parseInt(value, 10) : 0;
    if (!isNaN(num) && num <= 99) {
      setSections(prevSections =>
        prevSections.map((s, index) =>
          index === idx ? { ...s, sets: num } : s
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
    <View className="border-2 trackme-border-gray bg-white rounded-lg shadow-lg my-3 p-4">
      {/* Section Name and Remove Button */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold">Section Description</Text>
          <Pressable onPress={handleSectionDeletion} className="py-3 pl-4">
            <Text className="trackme-red">Remove Section</Text>
          </Pressable>
        </View>
        <TextInput 
          className="border rounded-md p-3 bg-white text-black trackme-border-gray"
          value={section.name} 
          onChangeText={handleNameChange} 
          placeholder="e.g., Warm-up, Main Set, Cool-down"
        />
      </View>

      {/* Sets Input */}
      <View className="flex-row justify-between w-[75%] mx-auto items-center mb-3">
        <Text className="text-lg font-bold">Sets</Text>
        <View className="border trackme-border-gray rounded-lg p-1 bg-white">
          <TextInput
            value={section.sets ? section.sets.toString() : ''}
            onChangeText={handleSetsChange}
            className="w-12 text-center"
          />
        </View>
      </View>
      {/* Dynamically rendered Exercises */}
      {section.exercises && section.exercises.length > 0 &&
        <ExerciseCreation 
          exercises={section.exercises} 
          handleExerciseRemoval={handleExerciseRemoval} 
          setSections={setSections} 
          idx={idx} 
        />
      }
      {/* Add Exercise Buttons */}
      <View className="flex-row justify-around items-center mb-4 border-y border-gray-200 py-3">
        <TextButton text="Add Run" onPress={() => handleExerciseAddition(ExerciseType.Run)} />
        <TextButton text="Add Strength" onPress={() => handleExerciseAddition(ExerciseType.Strength)} />
        <TextButton text="Add Rest" onPress={() => handleExerciseAddition(ExerciseType.Rest)} />
      </View>
    </View>
  );
};

export default SectionCreation;
