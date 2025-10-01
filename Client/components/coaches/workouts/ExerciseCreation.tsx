import { Text, TextInput, Pressable, View } from "react-native";
import { Exercise } from "../../../types/Exercise";
import Section from "../../../types/Sections";
import { Rest } from "../../../types/Rest";
import { ExerciseType } from "../../../assets/constants/Enums";

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

  // Specialized handler for rest durations: minutes or seconds
  const handleRestChange = (partIdx: number, unit: 'minutes' | 'seconds', value: string) => {
    const numericValue = value ? parseInt(value) : 0;
    if (isNaN(numericValue)) return;

    // Cast the current exercise to a Rest type to access duration
    const currentExercise = exercises[partIdx] as Rest;
    const currentMinutes = Math.floor(currentExercise.duration / 60);
    const currentSeconds = currentExercise.duration % 60;

    // Recalculate total duration based on which unit was updated
    let newDuration = 0;
    if (unit === 'minutes') {
      newDuration = numericValue * 60 + currentSeconds;
    } else {
      newDuration = currentMinutes * 60 + numericValue;
    }
    // Delegate to the generic change handler
    handleExerciseChange(partIdx, 'duration', newDuration);
  };

  const handleRepsChange = (partIdx: number, value: string) => {
    const numericValue = value ? parseInt(value) : 0;
    if (isNaN(numericValue)) return;
    if(numericValue === 0){
      handleExerciseChange(partIdx, 'reps', undefined);
      return;
    }
    handleExerciseChange(partIdx, 'reps', numericValue);
  }

  return (
    <View className="bg-gray-50 rounded-lg p-4 mb-4 gap-y-4">
      <Text className="text-lg font-bold text-center">Exercises</Text>

      {exercises.map((exercise: Exercise, partIdx: number) => (
        <View key={partIdx} className="p-3 border border-gray-200 rounded-lg bg-white">
          <View className="flex-row justify-between items-center mb-2">
            {/* Display the exercise type with capitalization */}
            <Text className="font-bold text-gray-600">
              {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
            </Text>
            {/* Button to remove this exercise */}
            <Pressable onPress={() => handleExerciseRemoval(partIdx)}>
              <Text className="trackme-red">Remove</Text>
            </Pressable>
          </View>

          {/* Conditional rendering for 'Run' exercises */}
          {exercise.type === ExerciseType.Run && (
            <View className="gap-y-3">
              <View>
                <Text className="text-sm font-medium text-gray-500 mb-1">Distance (m)</Text>
                <TextInput
                  className={`border rounded-md p-3 bg-white text-black ${exercise.distance === 0 ? 'border-red-500' : 'trackme-border-gray'}`}
                  value={exercise.distance ? `${exercise.distance}` : ''}
                  keyboardType="numeric"
                  onChangeText={text => handleExerciseChange(partIdx, 'distance', text ? Number(text) : 0)}
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-500 mb-1">Reps (Optional)</Text>
                <TextInput
                  className="border trackme-border-gray rounded-md p-3 bg-white text-black"
                  value={exercise.reps ? `${exercise.reps}` : ''}
                  keyboardType="numeric"
                  onChangeText={text => handleRepsChange(partIdx, text)}
                />
              </View>
            </View>
          )}

          {/* Conditional rendering for 'Strength' exercises */}
          {exercise.type === ExerciseType.Strength && (
            <View className="gap-y-3">
              <View>
                <Text className="text-sm font-medium text-gray-500 mb-1">Description</Text>
                <TextInput
                  className={`border rounded-md p-3 bg-white text-black ${!exercise.description ? 'border-red-500' : 'trackme-border-gray'}`}
                  value={exercise.description}
                  onChangeText={text => handleExerciseChange(partIdx, 'description', text)}
                  placeholder="e.g., Bench Press, Squats"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-500 mb-1">Reps (Optional)</Text>
                <TextInput
                  className="border trackme-border-gray rounded-md p-3 bg-white text-black"
                  value={exercise.reps ? `${exercise.reps}` : ''}
                  keyboardType="numeric"
                  onChangeText={text => handleRepsChange(partIdx, text)}
                />
              </View>
            </View>
          )}

          {/* Conditional rendering for 'Rest' exercises */}
          {exercise.type === ExerciseType.Rest && (
            <View>
              <Text className="text-sm font-medium text-gray-500 mb-1">Duration</Text>
              <View className="flex-row items-center gap-x-2">
                {/* Minutes input */}
                <TextInput
                  className={`border rounded-md p-3 bg-white text-black text-center w-20 ${exercise.duration === 0 ? 'border-red-500' : 'trackme-border-gray'}`}
                  placeholder="Mins"
                  keyboardType="numeric"
                  onChangeText={text => handleRestChange(partIdx, 'minutes', text)}
                  maxLength={2}
                  value={exercise.duration / 60 === 0 ? '' : Math.floor(exercise.duration / 60).toString()}
                />
                <Text className="font-bold text-lg">:</Text>
                {/* Seconds input */}
                <TextInput
                  className={`border rounded-md p-3 bg-white text-black text-center w-20 ${exercise.duration === 0 ? 'border-red-500' : 'trackme-border-gray'}`}
                  placeholder="Secs"
                  keyboardType="numeric"
                  onChangeText={text => handleRestChange(partIdx, 'seconds', text)}
                  maxLength={2}
                  value={exercise.duration % 60 === 0 ? '' : (exercise.duration % 60).toString()}
                />
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

export default ExerciseCreation;