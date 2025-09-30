import { Text, TextInput, Pressable, View } from "react-native";

/**
 * A component for dynamically adding and removing time and distance input fields.
 * It is used for both individual athlete and group input displays.
 * @param {object} props - The component props.
 * @param {Record<string, { time?: string; distance?: string }[]>} props.currentInputs - State object holding all inputs, keyed by a unique identifier.
 * @param {React.Dispatch<React.SetStateAction<Record<string, { time?: string; distance?: string }[]>>>} props.setCurrentInputs - The state setter function for currentInputs.
 * @param {string} props.identifierId - The unique ID for the current group or athlete to associate the inputs with.
 * @param {(groupId: string, idx: number, text: string) => void} props.handleTimeChange - Callback to handle changes in the time input.
 * @param {(groupId: string, idx: number, text: string) => void} props.handleDistanceChange - Callback to handle changes in the distance input.
 */
const InputTracking = ({currentInputs, setCurrentInputs, identifierId, handleTimeChange, handleDistanceChange}:
    {
        currentInputs: Record<string, { time: string | undefined; distance: string | undefined}[]>,
        setCurrentInputs: React.Dispatch<React.SetStateAction<Record<string, { time: string | undefined; distance: string | undefined}[]>>>,
        identifierId: string,
        handleTimeChange: (groupId:string, idx:number, text:string)=>void,
        handleDistanceChange: (groupId:string, idx:number, text:string)=>void,
    }
) => {   
    return(
        <>
            {/* Render all existing input pairs for the given identifierId */}
            {currentInputs[identifierId]?.map((input, idx) => (
                <View key={idx} className="flex flex-row justify-between items-center mb-2">
                    {/* Time input field */}
                    <TextInput
                        placeholder="Time"
                        keyboardType="numeric"
                        value={input?.time}
                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                        onChangeText={text => handleTimeChange(identifierId, idx, text)}
                    />
                    {/* Distance input field */}
                    <TextInput
                        placeholder="Distance"
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                        value={input?.distance}
                        onChangeText={text => handleDistanceChange(identifierId, idx, text)}
                    />
                    {/* Units label */}
                    <Text>Meters</Text>
                </View>
            ))}
            <View className="flex flex-row items-center justify-between">
                {/* Button to remove the last input pair from the current group */}
                <Pressable
                    className="trackme-bg-red rounded-lg p-2 w-[45%]"
                    onPress={() => {
                    setCurrentInputs(prev => {
                        // Get the current inputs for the identifier and remove the last element
                        const updatedGroup = prev[identifierId]?.slice(0, -1) || [];
                        // Return the updated state
                        return { ...prev, [identifierId]: updatedGroup };
                    });
                }}>
                    <Text className="text-white text-center">Remove</Text>
                </Pressable>

                {/* Button to add a new, empty input pair to the current group */}
                <Pressable 
                    className="trackme-bg-red rounded-lg p-2 w-[45%]"
                    onPress={() => {
                        // Get the existing inputs for this identifier, or an empty array if none exist
                        const existingInputs = currentInputs[identifierId] || [];
                        // Create a new array with the existing inputs plus one new empty input
                        const updatedInputs = [...existingInputs, { time: '', distance: '' }];
                        
                        // Update the state with the new array for this identifier
                        setCurrentInputs(prev => ({ ...prev, [identifierId]: updatedInputs }));
                    }
                }>
                    <Text className="text-white text-center">Add</Text>
                </Pressable>
            </View>
        </>
    );
}

export default InputTracking;