import { useState } from "react";
import { Text, TextInput, View, ScrollView, TouchableOpacity } from "react-native";
import Exercise from "../../../types/Exersise";
import ExerciseCreation from "../../../components/coaches/workouts/ExerciseCreation";

//Page for workout creation by coaches
const WorkoutCreation = ({workout, handleWorkoutCreation, pageTitle, buttonText}: 
    {workout?: any; handleWorkoutCreation: (workoutData:any) => void; pageTitle: string; buttonText: string;}) => {

  const [title, setTitle] = useState<string>(workout?.title || "");
  const [description, setDescription] = useState<string>(workout?.description || "");
  const [exercises, setExercises] = useState<Array<Exercise>>(workout?.exercises || []);
  //errors on form
  const [errors, setErrors] = useState<number>(0);

  const handleCreation = async () => {
    if(errors > 0){
      alert("Please fill in all required fields");
      return;
    }
    const workoutData:Record<string, any> = {
      'title': title,
      'description': description,
      'exercises': exercises
    };
    if(workout){
      workoutData['workoutId'] = workout.groupWorkoutId;
    }
    handleWorkoutCreation(workoutData);
  };

  const handleTitleChange = (text:string) => {
    if(text.length <= 50){
      setTitle(text);
    }
  }

  const titleDescriptionLayout = (text:string)=>{
    return(
      <View className="border border-red-700 rounded-lg m-4 p-3 bg-white">
        <Text className="font-bold">{text}</Text>
        <TextInput
          value={text === "Title" ? title : description}
          onChangeText={text === "Title" ? handleTitleChange : setDescription}
          className="border-b border-red-700 text-black py-1 mt-1"
          placeholder={`Enter workout ${text}`}
          placeholderTextColor="#888"
          multiline
        />
      </View>
    );
  }
  return (
    <View>
      {/* WORKOUT TITLE INPUT */}
      {titleDescriptionLayout("Title")}

      {/* WORKOUT DESCRIPTION INPUT */}
      {titleDescriptionLayout("Description")}

      {/* EXERCISES LIST AND ADD EXERCISE BUTTON */}
      <View className="mx-4">
      {/* Render each exercise input */}
      {exercises.map((exercise, idx) => (
        <ExerciseCreation key={idx} excercise={exercise} setExercises={setExercises} idx={idx} setErrors={setErrors}/>
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
    </View>
  );
};

export default WorkoutCreation;