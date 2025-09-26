import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ExercisePart from "../../../types/ExercisePart";

/**
 * A component for creating and managing the parts (distances) of an exercise.
 * @param {object} props - The component props.
 * @param {ExercisePart[]} props.exerciseParts - An array of exercise parts for a single exercise.
 * @param {(partIdx: number) => void} props.handleDistanceRemoval - Function to handle the removal of an exercise part.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} props.setExercises - State setter function to update the list of all exercises.
 * @param {number} props.idx - The index of the parent exercise in the main exercises array.
 */
const ExercisePartCreation = ({exerciseParts, handleDistanceRemoval, setExercises, idx}:
    {
        exerciseParts: ExercisePart[], 
        handleDistanceRemoval: (partIdx:number)=>void, 
        setExercises: React.Dispatch<React.SetStateAction<any[]>>, 
        idx: number
    }
) => {
  return(
    // Container for the exercise part creation section.
    <View className="bg-gray-50 rounded-lg p-4 mb-4">
        <Text className="text-lg font-bold">Distances</Text>
        {/* Map over each exercise part to render its input fields. */}
        {exerciseParts.map((part: any, partIdx: number) => (
        <View className="mb-3" key={partIdx}>
            {/* Button to remove this specific exercise part */}
            <View className="flex flex-row justify-end items-center mb-1">
            <TouchableOpacity onPress={() => handleDistanceRemoval(partIdx)}>
                <Text className="text-[#E63946]">Remove</Text>
            </TouchableOpacity>
            </View>
            {/* Distance Input */}
            <TextInput 
                // Apply a red border if distance is 0, indicating an error or incomplete field.
                className={`border rounded-md p-3 bg-white text-black ${part.distance === 0 ? 'border-red-500' : 'border-gray-300'}`}
                // Display the distance value, or an empty string if it's falsy (e.g., 0).
                value={part.distance ? `${part.distance}` : ''} 
                inputMode="numeric"
                onChangeText={text => {
                    // Update distance if the input is a valid number.
                    if(text && !isNaN(Number(text))) {
                        const updatedParts = [...exerciseParts];
                        updatedParts[partIdx].distance = Number(text); // Update the distance for the specific part.
                        // Update the parent exercises state with the modified exercise parts.
                        setExercises((prev) => prev.map((ex, index) =>  index === idx ? { ...ex, exerciseParts: updatedParts } : ex));
                    }
                    // Handle the case where the input is cleared.
                    if(text === '') {
                        const updatedParts = [...exerciseParts];
                        updatedParts[partIdx].distance = 0; // Set distance to 0.
                        // Update the parent exercises state.
                        setExercises((prev) => prev.map((ex, index) => index === idx ? { ...ex, exerciseParts: updatedParts } : ex));
                    }
                }} 
                />
            </View>
        ))}
    </View>
  );
}

export default ExercisePartCreation;