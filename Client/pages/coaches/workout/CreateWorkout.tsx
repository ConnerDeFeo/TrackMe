import { useState } from "react";
import { Button, Text, TextInput, View, ScrollView, TouchableOpacity, Image } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";
import Exercise from "../../../types/Exersise";
import ExcerciseCreation from "../../../components/coaches/workouts/ExcersiceCreation";

//Page for workout creation by coaches
const CreateWorkout = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { workout } = (route.params as { workout?: any }) || {};

  const [title, setTitle] = useState<string>(workout?.title || "");
  const [description, setDescription] = useState<string>(workout?.description || "");
  const [exersies, setexersies] = useState<Array<Exercise>>(workout?.exersies || []);

  const handleWorkoutCreation = async () => {
    const coachId = await UserService.getUserId();
    const workoutData:Record<string, any> = {
      'title': title,
      'description': description,
      'exersies': exersies,
      'coachId': coachId
    };
    if(workout){
      workoutData['workoutId'] = workout.workout_id; // Include workoutId if editing an existing workout
    }
    
    const resp = await CoachWorkoutService.createWorkout(workoutData);
    if (resp.ok){
      navigation.navigate('Workouts');
    }
      
  };
  return (
    <ScrollView className="mt-16 bg-white">
      {/* HEADER: Title and Add Workout Button */}
      <View className="flex-row justify-between items-center p-4">
      <Text className="text-4xl font-bold">Create Workout</Text>
      </View>

      {/* WORKOUT TITLE INPUT */}
      <View className="border border-red-700 rounded-lg m-4 p-3 bg-white">
      <Text className="font-bold">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        className="border-b border-red-700 text-black py-1 mt-1"
        placeholder="Enter workout title"
        placeholderTextColor="#888"
      />
      </View>

      {/* WORKOUT DESCRIPTION INPUT */}
      <View className="border border-red-700 rounded-lg mx-4 mb-4 p-3 bg-white">
      <Text className="font-bold">Description</Text>
      <TextInput
        multiline
        value={description}
        onChangeText={setDescription}
        className="border-b border-red-700 text-black py-1 mt-1 min-h-10"
        placeholder="Enter workout description"
        placeholderTextColor="#888"
      />
      </View>

      {/* EXERCISES LIST AND ADD EXERCISE BUTTON */}
      <View className="mx-4">
      {/* Render each exercise input */}
      {exersies.map((exersise, idx) => (
        <ExcerciseCreation key={idx} excercise={exersise} setExcersies={setexersies} />
      ))}
      {/* Button to add a new exercise */}
      <TouchableOpacity
        className="bg-red-700 rounded-lg py-2 items-center mt-2 mb-4"
        onPress={() => setexersies([...exersies, { name: '', id: exersies.length }])}
      >
        <Text className="text-white font-bold">Create exercise</Text>
      </TouchableOpacity>
      </View>

      {/* CREATE WORKOUT BUTTON */}
      <TouchableOpacity
      className="bg-black rounded-lg py-3 items-center mx-4 mb-8"
      onPress={handleWorkoutCreation}
      >
      <Text className="text-white font-bold text-lg">Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateWorkout;