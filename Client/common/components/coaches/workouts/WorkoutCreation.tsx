import { useEffect, useState } from "react";
import { Text, TextInput, View, Pressable, Image } from "react-native";
import SectionCreation from "./SectionCreation";
import TextButton from "../../display/TextButton";
import Section from "../../../types/workouts/Section";
import { ExerciseType } from "../../../constants/Enums";
import { Exercise } from "../../../types/workouts/Exercise";
import CoachWorkoutService from "../../../../services/CoachWorkoutService";
import TrackMeButton from "../../display/TrackMeButton";

// Page for workout creation by coaches
const WorkoutCreation = ({
  workoutId,
  handleWorkoutCreation,
  buttonText,
  onRemove
}: {
  workoutId?: string
  handleWorkoutCreation: (workoutData: any) => void
  buttonText: string
  onRemove?: () => void
}) => {

  // Local state for title, description and sections list
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sections, setSections] = useState<Array<Section>>([]);
  const [groupWorkoutId, setGroupWorkoutId] = useState<string | undefined>(undefined);
  const [aiPrompt, setAIPrompt] = useState<string>("");

  useEffect(() => {
    const fetchWorkout = async () => {
      if (workoutId) {
        const resp = await CoachWorkoutService.getWorkout(workoutId);
        if (resp.ok) {
          const data = await resp.json();
          setTitle(data.title || ""); 
          setDescription(data.description || "");
          setSections(data.sections || []);
          setGroupWorkoutId(data.groupWorkoutId);
        }
      }
    };

    fetchWorkout();
  }, [workoutId]);

  // Validate inputs and call parent handler
  const handleCreation = async () => {
    let isValid = true;
    // Ensure title is not empty
    if (title.trim() === "") {
      alert("Please fill in all required fields");
      return;
    }

    // Ensure each section has a name and at least one set
    if (sections.length > 0) {
      sections.forEach((section: Section) => {
        section.exercises?.forEach((exercise: Exercise) => {
          switch (exercise.type) {
            case ExerciseType.Run:
              if (exercise.distance === 0) isValid = false;
              break;
            case ExerciseType.Strength:
              if (!exercise.description) isValid = false;
              break;
            case ExerciseType.Rest:
              if (!exercise.minReps || exercise.minReps === 0) isValid = false;
              break;
          }
        })
        if ( section?.minSets === 0) isValid = false;
      })
    }

    if (!isValid) {
      alert("Please fill in all required fields");
      return;
    }

    // Build workout payload
    const workoutData: Record<string, any> = {
      title,
      description,
      sections
    }

    // Include IDs if editing existing workout
    workoutData.workoutId = workoutId
    workoutData.groupWorkoutId = groupWorkoutId
    // Pass data to parent component
    handleWorkoutCreation(workoutData)
  }

  // Restrict title length to 50 characters
  const handleTitleChange = (text: string) => {
    if (text.length <= 50) {
      setTitle(text)
    }
  }

  // Render a labeled input for title or description
  const titleDescriptionLayout = (label: string) => {
    const isTitle = label === "Title"
    return (
      <>
        <Text className="text-xl font-semibold my-2 ml-2">{label}</Text>
        <View className={`border-2 rounded-lg p-3 bg-white ${isTitle && title==='' ? 'border-red-300' : 'trackme-border-gray'}`}>
          <TextInput
            value={isTitle ? title : description}
            onChangeText={isTitle ? handleTitleChange : setDescription}
            className="text-black py-1 mt-1"
            placeholder={label}
            placeholderTextColor="#888"
            multiline
          />
        </View>
      </>
    )
  }

  const handleAIGeneration = async () => {
    const resp = await CoachWorkoutService.bedrockWorkoutGeneration(aiPrompt);
    console.log(resp);
    if(resp.ok){
      try{
        const data = await resp.json();
        setTitle(data.title);
        setDescription(data.description);
        setSections(data.sections);
      }catch(e){
        alert("Error parsing AI response");
        return;
      }
    }
  }

  return (
    <View className="mb-8 mx-2">
      <View className="my-3 gap-y-2">
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-x-2">
            <Text className="pl-4 font-bold text-xl text-center">AI Generation</Text>
            <Image source={require('../../../../assets/images/Sparkle.png')} className="w-6 h-6" />
          </View>
          <TextButton text="Generate workout" onPress={handleAIGeneration} />
        </View>
        <TextInput 
          className="h-24 border rounded-md p-3 bg-white text-black trackme-border-gray"
          multiline
          textAlignVertical="top"
          placeholder="2 x 400m sprints with 2min rest"
          value={aiPrompt}
          onChangeText={setAIPrompt}
        />
      </View>
      {/* Workout title input */}
      {titleDescriptionLayout("Title")}

      {/* Workout description input */}
      {titleDescriptionLayout("Description")}

      {/* Render each section creation form */}
      {sections.map((section, idx) => (
        <SectionCreation
          key={idx}
          section={section}
          setSections={setSections}
          idx={idx}
        />
      ))}

      <View className="flex flex-row justify-between items-center mt-2 mb-4">
        {/* Button to add a new section */}
        <TextButton text="Add section" onPress={() => setSections([...sections, { name: "", minSets:1}])} />

        {/* Button to submit the workout creation/edit */}
        <TextButton text={buttonText} onPress={handleCreation} />
      </View>
      {onRemove &&
        <TrackMeButton text="Remove" onPress={onRemove} red className="mx-4"/>
      }
    </View>
  )
}

export default WorkoutCreation