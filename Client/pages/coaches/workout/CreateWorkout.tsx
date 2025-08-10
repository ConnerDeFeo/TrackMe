import { useState } from "react";
import { Button, Text, TextInput, View, ScrollView } from "react-native";
import ExcerciseCreation from "../../../components/coaches/workouts/ExcersiceCreation";
import Exercise from "../../../types/Excersise";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";

//Page for workout creation by coaches
const CreateWorkout = () => {

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [excersies, setExcersies] = useState<Array<Exercise>>([]);

  const handleWorkoutCreation = async () => {
    const coachId = await UserService.getUserId();
    const workoutData = {
      'title': title,
      'description': description,
      'excersies': excersies,
      'coach_id': coachId
    };
    
    await CoachWorkoutService.createWorkout(workoutData);
      
  };
  return (
    <ScrollView>
        <Text>Create workout</Text>
        <View className="border">
          <Text>Title</Text>
          <TextInput value={title} onChangeText={setTitle} />
        </View>
        <View className="border">
          <Text>Description</Text>
          <TextInput multiline value={description} onChangeText={setDescription} />
        </View>
        <View>
          {excersies.map((excersise, idx) => (
            <ExcerciseCreation key={idx} excercise={excersise} setExcersies={setExcersies} />
          ))}
          <Button title="Create Excercise" onPress={() => setExcersies([...excersies, {name: '', id: excersies.length}])} />
        </View>
        <Button title="Create" onPress={handleWorkoutCreation}/>
    </ScrollView>
  );
};

export default CreateWorkout;