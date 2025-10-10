import { Text, TextInput, Pressable, View, Image } from "react-native";
import { useState } from "react";
import Section from "../../../types/workouts/Section";
import { Rest } from "../../../types/workouts/Rest";
import { ExerciseType } from "../../../constants/Enums";
import TimeInput from "../../TimeInput";
import { Exercise } from "../../../types/workouts/Exercise";

const ExerciseCreation = ({ exercises, handleExerciseRemoval, setSections, idx }:
  {
    exercises: Exercise[],
    handleExerciseRemoval: (partIdx: number) => void,
    setSections: React.Dispatch<React.SetStateAction<Section[]>>,
    idx: number
  }
) => {

  // Generic handler to update any field of an exercise at a given index
  const handleExerciseChange = (partIdx: number, field: string, value: any) => {
    // Create a shallow copy of the exercises array to avoid mutating props directly
    const updatedExercises = [...exercises];
    // Update the specific field on the copied exercise
    (updatedExercises[partIdx] as any)[field] = value;

    // Update the parent sections state to include the modified exercises
    setSections(prevSections => prevSections.map((section, sectionIdx) =>
      sectionIdx === idx ? { ...section, exercises: updatedExercises } : section
    ));
  };

  // Specialized handler for rest durations: minutes or seconds for min/max ranges
  const handleRestChange = (partIdx: number, field: 'minReps' | 'maxReps', unit: 'minutes' | 'seconds', value: string) => {
    const numericValue = value ? parseInt(value) : 0;
    if (isNaN(numericValue)) return;

    // Get current exercise and the current duration for the specified field
    const currentExercise = exercises[partIdx] as Rest;
    const currentDuration = currentExercise[field] || 0;
    const currentMinutes = Math.floor(currentDuration / 60);
    const currentSeconds = currentDuration % 60;

    // Recalculate total duration based on which unit was updated
    let newDuration = 0;
    if (unit === 'minutes') {
      newDuration = numericValue * 60 + currentSeconds;
    } else {
      newDuration = currentMinutes * 60 + numericValue;
    }
    // Delegate to the generic change handler
    handleExerciseChange(partIdx, field, newDuration);
  };

  const handleRepsChange = (partIdx: number, field: 'minReps' | 'maxReps', value: string) => {
    const numericValue = value ? parseInt(value) : undefined;
    if (value && isNaN(numericValue!)) return;
    handleExerciseChange(partIdx, field, numericValue);
  }

  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  const toggleNotes = (partIdx: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partIdx)) {
        newSet.delete(partIdx);
      } else {
        newSet.add(partIdx);
      }
      return newSet;
    });
  };

  return (
    <View className="rounded-lg mb-4">
      <Text className="text-xl font-bold text-center mt-2 border-y py-3 trackme-border-gray">Exercises</Text>

      {exercises.map((exercise: Exercise, partIdx: number) => (
        <View key={partIdx} className="p-3 border-b trackme-border-gray rounded-lg bg-white">
          <View className="flex-row justify-between items-center mb-1">
            {/* Display the exercise type with capitalization */}
            <Text className="font-semibold">
              {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
            </Text>
            <View className="flex-row items-center">
              {/* Button to toggle notes */}
              <Pressable 
                onPress={() => toggleNotes(partIdx)} 
                className={`py-3 px-4 ${expandedNotes.has(partIdx) || exercise.notes ? 'bg-blue-50' : ''} rounded`}
              >
                <Image source={require('../../../../assets/images/Notes.webp')} className="w-5 h-5" />
              </Pressable>
              {/* Button to remove this exercise */}
              <Pressable onPress={() => handleExerciseRemoval(partIdx)} className="py-3 pl-4">
                <Text className="trackme-red">Remove</Text>
              </Pressable>
            </View>
          </View>

          {/* Conditional rendering for 'Run' exercises */}
          {exercise.type === ExerciseType.Run && (
            <View className="gap-y-3 flex flex-row justify-between">
              <View className="w-[47.5%]">
                <Text className="text-sm font-medium text-gray-500 mb-1">Distance (m)</Text>
                <TextInput
                  className={`border rounded-md p-3 bg-white text-black ${exercise.distance === 0 ? 'border-red-500' : 'trackme-border-gray'}`}
                  value={exercise.distance ? `${exercise.distance}` : ''}
                  keyboardType="numeric"
                  onChangeText={text => handleExerciseChange(partIdx, 'distance', text ? Number(text) : 0)}
                />
              </View>
              <View className="w-[47.5%]">
                <Text className="text-sm font-medium text-gray-500 mb-1">Reps Range (Optional)</Text>
                <View className="flex-row items-center gap-x-2">
                  <TextInput
                    className="border trackme-border-gray rounded-md p-3 bg-white text-black flex-1"
                    placeholder="Min"
                    value={exercise.minReps ? `${exercise.minReps}` : ''}
                    keyboardType="numeric"
                    onChangeText={text => handleRepsChange(partIdx, 'minReps', text)}
                  />
                  <Text className="text-gray-500 font-medium">to</Text>
                  <TextInput
                    className="border trackme-border-gray rounded-md p-3 bg-white text-black flex-1"
                    placeholder="Max"
                    value={exercise.maxReps ? `${exercise.maxReps}` : ''}
                    keyboardType="numeric"
                    onChangeText={text => handleRepsChange(partIdx, 'maxReps', text)}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Conditional rendering for 'Strength' exercises */}
          {exercise.type === ExerciseType.Strength && (
            <View className="gap-y-3 flex flex-row justify-between">
              <View className="w-[47.5%]">
                <Text className="text-sm font-medium text-gray-500 mb-1">Description</Text>
                <TextInput
                  className={`border rounded-md p-3 bg-white text-black ${!exercise.description ? 'border-red-500' : 'trackme-border-gray'}`}
                  value={exercise.description}
                  onChangeText={text => handleExerciseChange(partIdx, 'description', text)}
                  placeholder="e.g., Push-ups"
                />
              </View>
              <View className="w-[47.5%]">
                <Text className="text-sm font-medium text-gray-500 mb-1">Reps Range (Optional)</Text>
                <View className="flex-row items-center gap-x-2">
                  <TextInput
                    className="border trackme-border-gray rounded-md p-3 bg-white text-black flex-1"
                    placeholder="Min"
                    value={exercise.minReps ? `${exercise.minReps}` : ''}
                    keyboardType="numeric"
                    onChangeText={text => handleRepsChange(partIdx, 'minReps', text)}
                  />
                  <Text className="text-gray-500 font-medium">to</Text>
                  <TextInput
                    className="border trackme-border-gray rounded-md p-3 bg-white text-black flex-1"
                    placeholder="Max"
                    value={exercise.maxReps ? `${exercise.maxReps}` : ''}
                    keyboardType="numeric"
                    onChangeText={text => handleRepsChange(partIdx, 'maxReps', text)}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Conditional rendering for 'Rest' exercises */}
          {exercise.type === ExerciseType.Rest && (
            <View className="gap-y-3 flex flex-row justify-between">
              <View>
                <Text className="text-sm font-medium text-gray-500 mb-1">Min Duration</Text>
                <TimeInput
                  handleMinutesChange={text => handleRestChange(partIdx, 'minReps', 'minutes', text)}
                  handleSecondsChange={text => handleRestChange(partIdx, 'minReps', 'seconds', text)}
                  currSeconds={exercise.minReps || 0}
                  required
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-500 mb-1">Max Duration (Optional)</Text>
                <TimeInput
                  handleMinutesChange={text => handleRestChange(partIdx, 'maxReps', 'minutes', text)}
                  handleSecondsChange={text => handleRestChange(partIdx, 'maxReps', 'seconds', text)}
                  currSeconds={exercise.maxReps || 0}
                />
              </View>
            </View>
          )}

          {/* Expandable Notes Section */}
          {expandedNotes.has(partIdx) && (
            <View className="mt-3 pt-3 border-t trackme-border-gray">
              <Text className="text-sm font-medium text-gray-500 mb-1">Notes</Text>
              <TextInput
                className="border trackme-border-gray rounded-md p-3 bg-white text-black"
                value={exercise.notes || ''}
                onChangeText={text => handleExerciseChange(partIdx, 'notes', text)}
                placeholder="Add notes for this exercise..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

export default ExerciseCreation;