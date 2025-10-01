import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import Exercise from "../../../types/Sections";
import SectionCreation from "./SectionCreation";

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
  const [sections, setSections] = useState<Array<Exercise>>(workout?.sections || [])

  // Validate inputs and call parent handler
  const handleCreation = async () => {
    let valid = true

    // Ensure each section has a name and at least one set
    if (sections.length > 0) {
      sections.forEach((exercise: Exercise) => {
        if (!exercise.name || exercise.name.trim() === "" || exercise?.sets === 0) {
          valid = false
        }
      })
    }

    // Ensure title is not empty
    if (!valid || title.trim() === "") {
      alert("Please fill in all required fields")
      return
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
      <View className="m-4">
        <Text className="text-xl font-semibold mb-2">{label}</Text>
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
      </View>
    )
  }

  return (
    <View className="mb-8">
      {/* Workout title input */}
      {titleDescriptionLayout("Title")}

      {/* Workout description input */}
      {titleDescriptionLayout("Description")}

      {/* List of sections and action buttons */}
      <View className="mx-4">
        {/* Render each section creation form */}
        {sections.map((section, idx) => (
          <SectionCreation
            key={idx}
            section={section}
            setSections={setSections}
            idx={idx}
          />
        ))}

        <View className="flex flex-row justify-between items-center my-4">
          {/* Button to add a new section */}
          <Pressable onPress={() => setSections([...sections, { name: "" }])}>
            <Text className="font-bold trackme-blue">Add section</Text>
          </Pressable>

          {/* Button to submit the workout creation/edit */}
          <Pressable onPress={handleCreation}>
            <Text className="font-bold trackme-blue">{buttonText}</Text>
          </Pressable>
        </View>
      </View>
      {onRemove &&
        <Pressable className="trackme-bg-red py-2 mx-4 rounded-lg mt-6 mb-2">
          <Text className="text-center font-bold text-white" onPress={onRemove}>Remove</Text>
        </Pressable>
      }
    </View>
  )
}

export default WorkoutCreation