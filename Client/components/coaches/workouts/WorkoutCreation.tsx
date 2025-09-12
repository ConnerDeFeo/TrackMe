import { useState } from "react";
import { Button, Text, TextInput, View, ScrollView, TouchableOpacity } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";
import Exercise from "../../../types/Exersise";
import ExerciseCreation from "../../../components/coaches/workouts/ExerciseCreation";

//Page for workout creation by coaches
const WorkoutCreation = ({workout, handleWorkoutCreation, pageTitle, buttonText}: 
    {workout?: any; handleWorkoutCreation: (workoutData:any) => void; pageTitle: string; buttonText: string;}) => {

  const [title, setTitle] = useState<string>(workout?.title || "");
  const [description, setDescription] = useState<string>(workout?.description || "");
  const [exercises, setExercises] = useState<Array<Exercise>>(workout?.exercises || []);

  const handleCreation = async () => {
    const coachId = await UserService.getUserId();
    const workoutData:Record<string, any> = {
      'title': title,
      'description': description,
      'exercises': exercises,
      'coachId': coachId
    };
    if(workout){
      workoutData['workoutId'] = workout.workoutId; // Include workoutId if editing an existing workout
    }
    handleWorkoutCreation(workoutData);
  };

  const titleDescriptionLayout = (text:string)=>{
    return(
      <View className="border border-red-700 rounded-lg m-4 p-3 bg-white">
        <Text className="font-bold">{text}</Text>
        <TextInput
          value={text === "Title" ? title : description}
          onChangeText={text === "Title" ? setTitle : setDescription}
          className="border-b border-red-700 text-black py-1 mt-1"
          placeholder={`Enter workout ${text}`}
          placeholderTextColor="#888"
        />
      </View>
    );
  }
  return (
    <ScrollView className="mt-16 bg-white">
      {/* HEADER: Title and Add Workout Button */}
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-4xl font-bold">{pageTitle}</Text>
      </View>

      {/* WORKOUT TITLE INPUT */}
      {titleDescriptionLayout("Title")}

      {/* WORKOUT DESCRIPTION INPUT */}
      {titleDescriptionLayout("Description")}

      {/* EXERCISES LIST AND ADD EXERCISE BUTTON */}
      <View className="mx-4">
      {/* Render each exercise input */}
      {exercises.map((exercise, idx) => (
        <ExerciseCreation key={idx} excercise={exercise} setExercises={setExercises} idx={idx}/>
      ))}
        {/* Button to add a new exercise */}
        <TouchableOpacity
          className="bg-[#E63946] rounded-lg py-2 items-center mt-2 mb-4"
          onPress={() => setExercises([...exercises, { name: ''}])}
        >
          <Text className="text-white font-bold">Add exercise</Text>
        </TouchableOpacity>
      </View>

      {/* CREATE WORKOUT BUTTON */}
      <TouchableOpacity
        className="bg-black rounded-lg py-3 items-center mx-4 mb-8"
        onPress={handleCreation}
      >
        <Text className="text-white font-bold text-lg">{buttonText}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default WorkoutCreation;