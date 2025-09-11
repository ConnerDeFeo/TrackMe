import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import Exercise from "../../../types/Exersise";
import { JSX } from "react";
/**
 * Component for creating and editing a single exercise within a workout.
 * @param {object} props - The component props.
 * @param {Exercise} props.excercise - The exercise object being created or edited.
 * @param {React.Dispatch<React.SetStateAction<Exercise[]>>} props.setExercise - The state setter function for the list of exercises.
 */
const ExerciseCreation = ({ excercise, setExercises, idx }: { excercise: Exercise; setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>; idx: number; }) => {
  // Determines whether to display the sets and reps section based on the existence of exercise parts.
  const displaySetsReps = excercise.exerciseParts !== undefined && excercise.exerciseParts.length > 0;

  /**
   * Handles the creation of a new exercise part component.
   * It adds a new, empty part to the current exercise's `exerciseParts` array.
   */
  const handleExcerciseComponentCreation = () => {
    let exerciseParts = excercise.exerciseParts;
    // If no exercise parts exist yet, initialize the array.
    if (!exerciseParts){ 
      exerciseParts = [];
    }
    // Add a new exercise part with default values.
    exerciseParts.push({ 'distance': 0, 'measurement': 'Meters' });
    // Update the state for the specific exercise being modified.
    setExercises((prev) => prev.map((ex,index) => 
      index === idx ? { ...ex, exerciseParts } : ex
    ));
  };

  /**
   * Renders a TextInput for either 'sets' or 'reps' and handles state updates.
   * @param {'sets' | 'reps'} field - The field to be updated.
   * @returns {JSX.Element} A TextInput component.
   */
  const setsReps = (field: 'sets' | 'reps'): JSX.Element => {
    return (
      <TextInput className="pl-4" value={excercise[field] ? `${excercise[field]}` : ''} onChangeText={text => {
        // Update state only if a valid number is entered.
        if(text && !isNaN(Number(text))) {
          const updatedExcercise = { ...excercise, [field]: Number(text) };
          setExercises((prev) => prev.map((ex, index) => index === idx ? updatedExcercise : ex));
        }
        // If the input is cleared, reset the value to 0.
        if(text === '') {
          setExercises((prev) => prev.map((ex, index) => index === idx ? { ...ex, [field]: 0 } : ex));
        }
      }} />
    );
  }

  return (
    <View className="border-2 border-red-500 bg-white rounded-lg shadow-lg my-3 p-4">
      {/* Exercise Name Section */}
      <View className="mb-4">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg font-bold mb-2">Name</Text>
          {/* Button to remove the entire exercise */}
          <TouchableOpacity onPress={() => setExercises((prev) => prev.filter((_, index) => index !== idx))}>
            <Text className="text-[#E63946] underline">Remove</Text>
          </TouchableOpacity>
        </View>
        <TextInput 
          className="border border-gray-300 rounded-md p-3 bg-white text-black"
          value={excercise.name} 
          onChangeText={text => {
            // Update the exercise name in the state.
            const updatedExercise = { ...excercise, name: text };
            setExercises((prev) => prev.map((ex, index) => (index === idx ? updatedExercise : ex)));
          }} 
        />
      </View>

      {/* Sets, Reps, and Exercise Parts Section */}
      {displaySetsReps && (
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          {/* Sets Input */}
          <View className="mb-3">
            <Text className="text-lg font-bold mb-2 pl-2">Sets</Text>
            <View className="border border-gray-300 rounded-md bg-white">
              {setsReps('sets')}
            </View>
          </View>
          {/* Reps Input */}
          <View className="mb-3">
            <Text className="text-lg font-bold mb-2 pl-2">Reps</Text>
            <View className="border border-gray-300 rounded-md bg-white">
              {setsReps('reps')}
            </View>
          </View>

          {/* Dynamically rendered Exercise Parts */}
          <Text className="text-lg font-bold">Distances</Text>
          {excercise.exerciseParts && excercise.exerciseParts.map((part: any, idx: number) => (
              <View className="mb-3" key={idx}>
                {/* Button to remove this specific exercise part */}
                <View className="flex flex-row justify-end items-center mb-1">
                  <TouchableOpacity onPress={() => {
                    const updatedParts = [...excercise.exerciseParts!];
                    updatedParts.splice(idx, 1); // Remove the part at the current index.
                    console.log("Current exercise: ", excercise);
                    console.log("Updated Parts: ",updatedParts);
                    setExercises((prev) => prev.map((ex, index) => index === idx ? { ...ex, exerciseParts: updatedParts } : ex));
                  }}>
                    <Text className="text-[#E63946] underline">Remove</Text>
                  </TouchableOpacity>
                </View>
                {/* Distance Input */}
                <TextInput 
                  className="border border-gray-300 rounded-md p-3 bg-white text-black"
                  value={part.distance ? `${part.distance}` : ''} 
                  onChangeText={text => {
                    // Update distance if the input is empty or a valid number.
                    if(text === '' || (text && !isNaN(Number(text)))) {
                      const updatedParts = [...excercise.exerciseParts!];
                      updatedParts[idx].distance = Number(text);
                      setExercises((prev) => prev.map((ex, index) => (index === idx ? { ...ex, exerciseParts: updatedParts } : ex)));
                    }
                  }} 
                />
              </View>
          ))}
        </View>
      )}

      {/* Button to add a new exercise part */}
      <View className="mt-4">
        <Button 
          title="Add Distance" 
          color="#E63946"
          onPress={handleExcerciseComponentCreation} 
        />
      </View>
    </View>
  );
};

export default ExerciseCreation;
