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

  return (
    <View className="border my-3">
      <Text>Create Excercise</Text>
      {/** Name */}
      <View>
        <Text className="text-lg font-bold">Name</Text>
        <TextInput value={excercise.name} onChangeText={text => {
          const updatedExcercise = { ...excercise, name: text };
          setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? updatedExcercise : ex)));
        }} />
      </View>
      {/** Sets and Reps */}
      {diplaySetsReps && (
        <View>
          <Text className="text-lg font-bold">Sets</Text>
          <TextInput value={excercise.sets && `${excercise.sets}` || ''} onChangeText={text => {
            //Update only if valid number was entered
            if(text && !isNaN(Number(text))) {
              const updatedExcercise = { ...excercise, sets: Number(text) };
              setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? updatedExcercise : ex)));
            }
            if(text === '') {
              setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, sets: 0 } : ex)));
            }
          }} />
          <Text className="text-lg font-bold">Reps</Text>
          <TextInput value={excercise.reps && `${excercise.reps}` || ''} onChangeText={text => {
            //Update only if valid number was entered
            if(text && !isNaN(Number(text))) {
              const updatedExcercise = { ...excercise, reps: Number(text) };
              setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? updatedExcercise : ex)));
            }
            if(text === '') {
              setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, reps: 0 } : ex)));
            }
          }} />
          {/** Exercise Parts */}
          {excercise.exerciseParts && excercise.exerciseParts.map((part: any, idx: number) => (
            <View key={idx}>
              <Text className="text-lg font-bold">Distance</Text>
              <TextInput value={part.distance && `${part.distance}` || ''} onChangeText={text => {
                if(text == '' || text && !isNaN(Number(text))) {
                  const updatedParts = [...excercise.exerciseParts!];
                  updatedParts[idx].distance = Number(text);
                  setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: updatedParts } : ex)));
                }
              }} />
              <Text className="text-lg font-bold">Measurement</Text>
              <TextInput value={part.measurement} onChangeText={text => {
                const updatedParts = [...excercise.exerciseParts!];
                updatedParts[idx].measurement = text;
                setExcersies((prev) => prev.map((ex) => (ex.id === excercise.id ? { ...ex, exerciseParts: updatedParts } : ex)));
              }} />
            </View>
          ))}
        </View>
        
      )}
      <Button title="add" onPress={() => {handleExcerciseComponentCreation()}} />
    </View>
  );
};

export default ExcerciseCreation;
