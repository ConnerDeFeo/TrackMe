import { Text, TextInput, Pressable, View } from "react-native";
import Variables from "../../../common/constants/Variables";
import ExerciseCreation from "./ExerciseCreation";
import Section from "../../../common/types/workouts/Section";
import { ExerciseType } from "../../../common/constants/Enums";
import TextButton from "../../display/TextButton";
import { Exercise } from "../../../common/types/workouts/Exercise";

/**
 * Component for creating and editing a single exercise section within a workout.
 * @param {object} props - The component props.
 * @param {Section} props.section - The section object being created or edited.
 * @param {React.Dispatch<React.SetStateAction<Section[]>>} props.setSections - The state setter function for the list of sections.
 * @param {number} props.idx - The index of this section in the parent sections array.
 */
const SectionCreation = ({ section, setSections, idx }: 
  { section: Section; setSections: React.Dispatch<React.SetStateAction<Section[]>>; idx: number; }) => {
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

      {/* Min Sets Input */}
      <View className="flex-row justify-between w-[85%] mx-auto items-center mb-3">
        <Text className="text-lg font-bold mt-4">Set Range</Text>
        <View className="flex flex-row justify-between w-[70%] items-center">
          <View className="w-[40%]">
            <Text className="text-sm text-gray-500">Min</Text>
            <TextInput
              value={section.minSets ? section.minSets.toString() : ''}
              onChangeText={handleMinSetsChange}
              className={`border rounded-md p-3 bg-white text-black ${section.minSets === 0 ? 'border-red-500' : 'trackme-border-gray'}`}
            />
          </View>
          <Text className="text-lg font-bold text-gray-500 mt-4">to</Text>
          <View className="w-[40%]">
            <Text className="text-sm text-gray-500">Max (Optional)</Text>
            <TextInput
              value={section.maxSets ? section.maxSets.toString() : ''}
              onChangeText={handleMaxSetsChange}
              className="border trackme-border-gray rounded-md p-3 bg-white text-black"
            />
          </View>
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
