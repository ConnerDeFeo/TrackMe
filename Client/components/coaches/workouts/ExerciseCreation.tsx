import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Exercise from "../../../types/Exersise";
import { JSX, useEffect, useState } from "react";
import Variables from "../../../assets/constants/Variables";
import ExercisePartCreation from "./ExercisePartCreation";
/**
 * Component for creating and editing a single exercise within a workout.
 * @param {object} props - The component props.
 * @param {Exercise} props.excercise - The exercise object being created or edited.
 * @param {React.Dispatch<React.SetStateAction<Exercise[]>>} props.setExercise - The state setter function for the list of exercises.
 */
const ExerciseCreation = ({ excercise, setExercises, idx }: 
  { excercise: Exercise; setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>; idx: number; }) => {
    const [displaySetsReps, setDisplaySetsReps] = useState<boolean>(excercise.reps !== undefined || excercise.sets !== undefined);

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
  };

  const handleDistanceRemoval = (partIdx:number) => {
    if(excercise.exerciseParts){
      const updatedParts = [...excercise.exerciseParts];
      updatedParts.splice(partIdx, 1);
      setExercises((prev) => prev.map((ex,index) => 
        index === idx ? { ...ex, exerciseParts:updatedParts } : ex
      ));
    }
  };

  const handleSetsRepsRemoval = ()=>{
    setDisplaySetsReps(false);
    setExercises((prev) => prev.map((ex,index) => {
      const updateExercise = { ...ex};
      delete updateExercise['sets'];
      delete updateExercise['reps'];
      return index === idx ? updateExercise : ex
    }));
  }

  const handleSetsRepsAddition = ()=>{
    setDisplaySetsReps(true);
    setExercises((prev) => prev.map((ex,index) => {
      return index === idx ? { ...ex, sets: 0, reps: 0 } : ex
    }));
  }

  const handleSetsRepsChange = (field: 'sets' | 'reps', value: string) => {
    // We’ll do two possible flows: valid number, or cleared input.
    if (value && !isNaN(Number(value))) {
      const num = Number(value);
      if (num <= 99) {
        // Update the shared exercises state using functional update
        setExercises(prevExercises =>
          prevExercises.map((ex, index) =>
            index === idx ? { ...ex, [field]: num } : ex
          )
        );
      }
    } else if (value === '') {
      setExercises(prevExercises =>
        prevExercises.map((ex, index) =>
          index === idx ? { ...ex, [field]: 0 } : ex
        )
      );
    }
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
        <View className={`border rounded-md bg-white h-12 flex items-center ${excercise[field] && excercise[field] > 0 ? 'border-gray-300' : 'border-red-500'}`}>
          <TextInput className="text-center" value={excercise[field] ? `${excercise[field]}` : ''} onChangeText={text => handleSetsRepsChange(field, text)} />
        </View>
      </View>
    );
  }

  const handleExerciseDeletion = ()=>{
    setExercises((prev) => prev.filter((_, index) => index !== idx));
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
        <ExercisePartCreation 
          exerciseParts={excercise.exerciseParts} 
          handleDistanceRemoval={handleDistanceRemoval} 
          setExercises={setExercises} 
          idx={idx} 
        />
      }
    </View>
  );
};

export default ExerciseCreation;
