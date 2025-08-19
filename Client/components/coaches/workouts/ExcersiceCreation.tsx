import { Button, Text, TextInput, View } from "react-native";
import Exercise from "../../../types/Excersise";

//Component for a single excercise in a workout
const ExcerciseCreation: React.FC<{ excercise: Exercise; setExcersies: React.Dispatch<React.SetStateAction<Exercise[]>> }> = ({ excercise, setExcersies }) => {
  const diplaySetsReps = excercise.exerciseParts !==undefined; //Only display if parts are defined

  //Handles creation of excersice component
  const handleExcerciseComponentCreation = () => {
    let excerciseParts = excercise.exerciseParts;
    if (!excerciseParts){ //No excersices created yet, initialize list
      excerciseParts = [];
    }
    excerciseParts.push({ 'distance': 0, 'measurement': '' });
    setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: excerciseParts } : ex)));
  };

  //Generic function for displaying sets and reps
  const setsReps = (field: 'sets' | 'reps') => {
    return (
      <TextInput value={excercise[field] && `${excercise[field]}` || ''} onChangeText={text => {
        //Update only if valid number was entered
        if(text && !isNaN(Number(text))) {
          const updatedExcercise = { ...excercise, [field]: Number(text) };
          setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? updatedExcercise : ex)));
        }
        if(text === '') {
          setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, [field]: 0 } : ex)));
        }
      }} />
    );
  }

  return (
    <View className="border-2 border-red-500 bg-white rounded-lg shadow-lg my-3 p-4">
      <Text className="text-xl font-bold text-black text-center mb-4">Create Exercise</Text>
      {/** Name */}
      <View className="mb-4">
      <Text className="text-lg font-bold mb-2">Name</Text>
      <TextInput 
        className="border border-gray-300 rounded-md p-3 bg-white text-black"
        value={excercise.name} 
        onChangeText={text => {
        const updatedExcercise = { ...excercise, name: text };
        setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? updatedExcercise : ex)));
        }} 
      />
      </View>
      {/** Sets, Reps */}
      {diplaySetsReps && (
      <View className="bg-gray-50 rounded-lg p-4 mb-4">
        <View className="mb-3">
        <Text className="text-lg font-bold mb-2">Sets</Text>
        <View className="border border-gray-300 rounded-md bg-white">
          {setsReps('sets')}
        </View>
        </View>
        <View className="mb-3">
        <Text className="text-lg font-bold mb-2">Reps</Text>
        <View className="border border-gray-300 rounded-md bg-white">
          {setsReps('reps')}
        </View>
        </View>
        {/** Exercise Parts */}
        {excercise.exerciseParts && excercise.exerciseParts.map((part: any, idx: number) => (
        <View key={idx} className="bg-white border border-red-200 rounded-lg p-3 mb-3">
          <View className="mb-3">
          <Text className="text-lg font-bold mb-2">Distance</Text>
          <TextInput 
            className="border border-gray-300 rounded-md p-3 bg-white text-black"
            value={part.distance && `${part.distance}` || ''} 
            onChangeText={text => {
            if(text == '' || text && !isNaN(Number(text))) {
              const updatedParts = [...excercise.exerciseParts!];
              updatedParts[idx].distance = Number(text);
              setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: updatedParts } : ex)));
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
            setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: updatedParts } : ex)));
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
        color="#dc2626"
        onPress={() => {handleExcerciseComponentCreation()}} 
      />
      </View>
    </View>
  );
};

export default ExcerciseCreation;
