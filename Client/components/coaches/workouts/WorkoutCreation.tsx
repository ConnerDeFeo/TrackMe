import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import SectionCreation from "./SectionCreation";
import TextButton from "../../display/TextButton";
import Section from "../../../types/workouts/Section";
import { Exercise } from "../../../types/Exercise";
import { ExerciseType } from "../../../assets/constants/Enums";

// Page for workout creation by coaches
const WorkoutCreation = ({
  workout,
  handleWorkoutCreation,
  buttonText,
  onRemove
}: {
  workout?: any
  handleWorkoutCreation: (workoutData: any) => void
  buttonText: string
  onRemove?: () => void
}) => {

  // Local state for title, description and sections list
  const [title, setTitle] = useState<string>(workout?.title || "")
  const [description, setDescription] = useState<string>(workout?.description || "")
  const [sections, setSections] = useState<Array<Section>>(workout?.sections || [])

  // Validate inputs and call parent handler
  const handleCreation = async () => {
    let isValid = true;
    // Ensure title is not empty
    if (title.trim() === "") {
      alert("Please fill in all required fields")
      return
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
        if ( section?.sets === 0) isValid = false;
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
    if (workout) {
      if (workout.workoutId) {
        workoutData.workoutId = workout.workoutId
      }
      if (workout.groupWorkoutId) {
        workoutData.groupWorkoutId = workout.groupWorkoutId
      }
    }

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
        <View className="border-2 trackme-border-gray rounded-lg p-3 bg-white">
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

  return (
    <View className="mb-8 mx-2">
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
        <TextButton text="Add section" onPress={() => setSections([...sections, { name: "", sets:1}])} />

        {/* Button to submit the workout creation/edit */}
        <TextButton text={buttonText} onPress={handleCreation} />
      </View>
      {onRemove &&
        <Pressable className="trackme-bg-red py-2 mx-4 rounded-lg mb-2">
          <Text className="text-center font-bold text-white" onPress={onRemove}>Remove</Text>
        </Pressable>
      }
    </View>
  )
}

export default WorkoutCreation