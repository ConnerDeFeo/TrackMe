import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Exercise from "../../../types/Exersise";
import { JSX, useState } from "react";
import Variables from "../../../constants/Variables";
/**
 * Component for creating and editing a single exercise within a workout.
 * @param {object} props - The component props.
 * @param {Exercise} props.excercise - The exercise object being created or edited.
 * @param {React.Dispatch<React.SetStateAction<Exercise[]>>} props.setExercise - The state setter function for the list of exercises.
 */
const ExerciseCreation = ({ excercise, setExercises, idx, setErrors }: 
  { excercise: Exercise; setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>; idx: number; setErrors: React.Dispatch<React.SetStateAction<number>>; }) => {
    const [displaySetsReps, setDisplaySetsReps] = useState<boolean>(excercise.reps !== undefined || excercise.sets !== undefined);

  // If current component deleted, remove its errors from total
  const [currentErrors, setCurrentErrors] = useState<number>(0);
  const handleErrorChange = (change:number)=>{
    setErrors(prev => prev + change);
    setCurrentErrors(prev => prev + change);
  }
  /**
   * Handles the creation of a new exercise part component.
   * It adds a new, empty part to the current exercise's `exerciseParts` array.
   */
  const handleDistanceAddition = () => {
    let exerciseParts = excercise.exerciseParts;
    let exists = true;
    // If no exercise parts exist yet, initialize the array.
    if (!exerciseParts) {
      exerciseParts = [];
      exists = false;
    }
    // Add a new exercise part with default values.
    exerciseParts.push({ 'distance': 0, 'measurement': Variables.meters });
    // Update the state for the specific exercise being modified.
    setExercises((prev) => prev.map((ex,index) => 
      index === idx ? { ...ex, exerciseParts:exerciseParts } : ex
    ));
    handleErrorChange(1); // Increment error count as new part with distance 0 is added
  };

  const handleDistanceRemoval = (partIdx:number) => {
    if(excercise.exerciseParts){
      const updatedParts = [...excercise.exerciseParts];
      updatedParts.splice(partIdx, 1);
      setExercises((prev) => prev.map((ex,index) => 
        index === idx ? { ...ex, exerciseParts:updatedParts } : ex
      ));
      handleErrorChange(-1); // Decrement error count as part is removed
    }
  };

  const handleSetsRepsRemoval = ()=>{
    setDisplaySetsReps(false);
    setExercises((prev) => prev.map((ex,index) => 
      index === idx ? { ...ex, sets: undefined, reps: undefined } : ex
    ));
  }

  const handleSetsRepsAddition = ()=>{
    setDisplaySetsReps(true);
    handleErrorChange(2);
  }

  /**
   * Renders a TextInput for either 'sets' or 'reps' and handles state updates.
   * @param {'sets' | 'reps'} field - The field to be updated.
   * @returns {JSX.Element} A TextInput component.
   */
  const setsReps = (field: 'sets' | 'reps'): JSX.Element => {
    return (
      <View>
        <Text className="text-lg font-bold">{field === 'sets' ? 'Sets' : 'Reps'}</Text>
        <View className={`border rounded-md bg-white ${excercise[field] && excercise[field] > 0 ? 'border-gray-300' : 'border-red-500'}`}>
          <TextInput className="text-center" value={excercise[field] ? `${excercise[field]}` : ''} onChangeText={text => {
            // Update state only if a valid number is entered.
            if(text && !isNaN(Number(text))) {
              if(excercise[field] === undefined) {
                handleErrorChange(-1); // Decrement error count if field was previously undefined
              }
              const updatedExcercise = { ...excercise, [field]: Number(text) };
              setExercises((prev) => prev.map((ex, index) => index === idx ? updatedExcercise : ex));
            }
            // If the input is cleared, remove the value from state.
            if(text === '') {
              setExercises((prev) => prev.map((ex, index) => index === idx ? { ...ex, [field]: undefined } : ex));
              handleErrorChange(1); // Increment error count if field is cleared
            }
          }} />
        </View>
      </View>
    );
  }

  const handleExerciseDeletion = ()=>{
    setExercises((prev) => prev.filter((_, index) => index !== idx));
    setErrors(prev => prev - currentErrors); // Remove this component's errors from total
  }

  return (
    <View className="border-2 bg-white rounded-lg shadow-lg my-3 p-4">
      {/* Exercise Name Section */}
      <View className="mb-4">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg font-bold mb-2">Name</Text>
          {/* Button to remove the entire exercise */}
          <TouchableOpacity onPress={handleExerciseDeletion}>
            <Text className="text-[#E63946]">Remove</Text>
          </TouchableOpacity>
        </View>
        <TextInput 
          className="border border-gray-300 rounded-md p-3 bg-white text-black"
          value={excercise.name} 
          inputMode="numeric"
          onChangeText={text => {
            // Update the exercise name in the state.
            const updatedExercise = { ...excercise, name: text };
            setExercises((prev) => prev.map((ex, index) => (index === idx ? updatedExercise : ex)));
          }} 
        />
      </View>
      <View className="flex flex-row justify-between items-center mb-4">
          {displaySetsReps ? 
            <TouchableOpacity onPress={handleSetsRepsRemoval}>
              <Text className="font-medium text-[#E63946]">Remove Sets/Reps</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={handleSetsRepsAddition}>
              <Text className="font-medium text-[#E63946]">Add Sets/Reps</Text>
            </TouchableOpacity>
          }
          {/* Button to add a new exercise part */}
          <TouchableOpacity onPress={handleDistanceAddition}>
            <Text className="font-medium text-[#E63946]">Add Distance</Text>
          </TouchableOpacity>
      </View>
      { displaySetsReps &&
          /* Sets and Reps Section */
          <View className="flex flex-row justify-between w-[75%] mx-auto items-center mb-3">
            {setsReps('sets')}
            <View className="flex flex-col items-center justify-end">
              <Text className="text-4xl font-bold">X</Text>
            </View>
            {setsReps('reps')}
          </View>
      }

              {/* Dynamically rendered Exercise Parts */}
      {excercise.exerciseParts && excercise.exerciseParts.length > 0 &&
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-lg font-bold">Distances</Text>
          {excercise.exerciseParts.map((part: any, partIdx: number) => (
            <View className="mb-3" key={partIdx}>
              {/* Button to remove this specific exercise part */}
              <View className="flex flex-row justify-end items-center mb-1">
                <TouchableOpacity onPress={() => handleDistanceRemoval(partIdx)}>
                  <Text className="text-[#E63946]">Remove</Text>
                </TouchableOpacity>
              </View>
              {/* Distance Input */}
              <TextInput 
                className={`border rounded-md p-3 bg-white text-black ${part.distance === 0 ? 'border-red-500' : 'border-gray-300'}`}
                value={part.distance ? `${part.distance}` : ''} 
                inputMode="numeric"
                onChangeText={text => {
                  if(text===''){
                    handleErrorChange(1); // Increment error count if field is cleared
                  }
                  // Update distance if the input is empty or a valid number.
                  if(text === '' || (text && !isNaN(Number(text)))) {
                    const updatedParts = [...excercise.exerciseParts!];
                    if(part.distance === 0) {
                      handleErrorChange(-1); // Decrement error count if field was previously undefined
                    }
                    updatedParts[partIdx].distance = Number(text); // Use the correct index for the part
                    setExercises((prev) => prev.map((ex, index) => (index === idx ? { ...ex, exerciseParts: updatedParts } : ex)));
                  }
                }} 
              />
            </View>
          ))}
        </View>
        }
    </View>
  );
};

export default ExerciseCreation;
