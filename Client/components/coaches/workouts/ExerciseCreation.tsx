import { Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Exercise from "../../../types/Exersise";

//Component for a single excercise in a workout
const ExerciseCreation: React.FC<{ excercise: Exercise; setExercise: React.Dispatch<React.SetStateAction<Exercise[]>> }> = ({ excercise, setExercise }) => {
  const diplaySetsReps = excercise.exerciseParts !== undefined && excercise.exerciseParts.length > 0; //Only display if parts are defined and exist

  //Handles creation of exersice component
  const handleExcerciseComponentCreation = () => {
    let excerciseParts = excercise.exerciseParts;
    if (!excerciseParts){ //No exersices created yet, initialize list
      excerciseParts = [];
    }
    excerciseParts.push({ 'distance': 0, 'measurement': '' });
    setExercise((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: excerciseParts } : ex)));
  };

  //Generic function for displaying sets and reps
  const setsReps = (field: 'sets' | 'reps') => {
    return (
      <TextInput value={excercise[field] && `${excercise[field]}` || ''} onChangeText={text => {
        //Update only if valid number was entered
        if(text && !isNaN(Number(text))) {
          const updatedExcercise = { ...excercise, [field]: Number(text) };
          setExercise((prev) => prev.map((ex) => (ex.id === excercise.id ? updatedExcercise : ex)));
        }
        if(text === '') {
          setExercise((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, [field]: 0 } : ex)));
        }
      }} />
    );
  }

  return (
    <View className="border-2 border-red-500 bg-white rounded-lg shadow-lg my-3 p-4">
      <Text className="text-xl font-bold text-center mb-4">Create Exercise</Text>
      {/** Name */}
      <View className="mb-4">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-lg font-bold mb-2">Name</Text>
        <TouchableOpacity onPress={() => setExercise((prev) => prev.filter((ex) => ex.id !== excercise.id))}>
          <Text className="text-[#E63946] underline">Remove</Text>
        </TouchableOpacity>
      </View>
      <TextInput 
        className="border border-gray-300 rounded-md p-3 bg-white text-black"
        value={excercise.name} 
        onChangeText={text => {
        const updatedExcercise = { ...excercise, name: text };
        setExercise((prev) => prev.map((ex) => (ex.id === excercise.id ? updatedExcercise : ex)));
        }} 
      />
      </View>
      {/** Sets, Reps */}
      {diplaySetsReps && (
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <View className="mb-3">
          <Text className="text-lg font-bold mb-2 pl-2">Sets</Text>
          <View className="border border-gray-300 rounded-md bg-white">
            {setsReps('sets')}
          </View>
          </View>
          <View className="mb-3">
          <Text className="text-lg font-bold mb-2 pl-2">Reps</Text>
          <View className="border border-gray-300 rounded-md bg-white">
            {setsReps('reps')}
          </View>
          </View>
          {/** Exercise Parts */}
          {excercise.exerciseParts && excercise.exerciseParts.map((part: any, idx: number) => (
          <View key={idx} className="bg-white border border-red-200 rounded-lg p-3 mb-3">
            <View className="mb-3">
              <View className="flex flex-row justify-between items-center">
                <Text className="text-lg font-bold mb-2">Distance</Text>
                <TouchableOpacity onPress={() => {
                  const updatedParts = [...excercise.exerciseParts!];
                  updatedParts.splice(idx, 1);
                  setExercise((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: updatedParts } : ex)));
                }}>
                  <Text className="text-[#E63946] underline">Remove</Text>
                </TouchableOpacity>
              </View>
              <TextInput 
                className="border border-gray-300 rounded-md p-3 bg-white text-black"
                value={part.distance && `${part.distance}` || ''} 
                onChangeText={text => {
                if(text == '' || text && !isNaN(Number(text))) {
                  const updatedParts = [...excercise.exerciseParts!];
                  updatedParts[idx].distance = Number(text);
                  setExercise((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: updatedParts } : ex)));
                }
                }} 
            />
            </View>
          <View>
          <Text className="text-lg font-bold mb-2">Measurement</Text>
          <TextInput 
            className="border border-gray-300 rounded-md p-3 bg-white text-black"
            value={part.measurement} 
            onChangeText={text => {
            const updatedParts = [...excercise.exerciseParts!];
            updatedParts[idx].measurement = text;
            setExercise((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: updatedParts } : ex)));
            }} 
          />
          </View>
        </View>
        ))}
      </View>
      )}
      <View className="mt-4">
      <Button 
        title="Add Exercise Part" 
        color="#E63946"
        onPress={() => {handleExcerciseComponentCreation()}} 
      />
      </View>
    </View>
  );
};

export default ExerciseCreation;
