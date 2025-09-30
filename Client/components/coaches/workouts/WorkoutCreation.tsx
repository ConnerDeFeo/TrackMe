import { useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import Exercise from "../../../types/Sections";
import SectionCreation from "./SectionCreation";

//Page for workout creation by coaches
const WorkoutCreation = ({workout, handleWorkoutCreation, buttonText}: 
    {workout?: any; handleWorkoutCreation: (workoutData:any) => void; buttonText: string;}) => {

  const [title, setTitle] = useState<string>(workout?.title || "");
  const [description, setDescription] = useState<string>(workout?.description || "");
  const [sections, setSections] = useState<Array<Exercise>>(workout?.sections || []);

  const handleCreation = async () => {
    let valid = true;
    if(sections.length > 0){
      sections.forEach((exercise:Exercise) => {
        if(!exercise.name || exercise.name.trim() === "" || exercise?.sets === 0){
          valid = false;
        }
      });
    }
    if(!valid || workout?.title?.trim() === "" ){
      alert("Please fill in all required fields");
      return;
    }
    const workoutData:Record<string, any> = {
      'title': title,
      'description': description,
      'sections': sections
    };
    if(workout){
      if (workout.workoutId) {
        workoutData['workoutId'] = workout.workoutId;
      }
      if(workout.groupWorkoutId){
        workoutData['groupWorkoutId'] = workout.groupWorkoutId;
      }
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
      <View className="m-4">
        <Text className=" text-xl font-bold mb-2">{text}</Text>
        <View className="border-2 rounded-lg p-3 bg-white">
          <TextInput
            value={text === "Title" ? title : description}
            onChangeText={text === "Title" ? handleTitleChange : setDescription}
            className="text-black py-1 mt-1"
            placeholder={text}
            placeholderTextColor="#888"
            multiline
          />
        </View>
      </View>
    );
  }
  return (
    <View className="mb-8">
      {/* WORKOUT TITLE INPUT */}
      {titleDescriptionLayout("Title")}

      {/* WORKOUT DESCRIPTION INPUT */}
      {titleDescriptionLayout("Description")}

      {/* EXERCISES LIST AND ADD EXERCISE BUTTON */}
      <View className="mx-4">
      {/* Render each exercise input */}
      {sections.map((section, idx) => (
        <SectionCreation key={idx} section={section} setSections={setSections} idx={idx}/>
      ))}
        <View className="flex flex-row justify-between items-center">
          {/* Button to add a new exercise */}
          <TouchableOpacity
            onPress={() => setSections([...sections, { name: ''}])}
          >
            <Text className="font-bold text-[#E63946]">Add section</Text>
          </TouchableOpacity>
          {/* CREATE WORKOUT BUTTON */}
          <TouchableOpacity
            onPress={handleCreation}
          >
            <Text className="font-bold text-[#E63946]">{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WorkoutCreation;