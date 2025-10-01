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
            {/* Input entries */}
            {currentInputs[identifierId]?.length > 0 ? (
                <View className="gap-y-3">
                    {currentInputs[identifierId]?.map((input, idx) => (
                        <View key={idx} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                            <View className="flex flex-row items-center gap-x-3">
                                {/* Time input field */}
                                <View className="flex-1">
                                    <Text className="text-xs font-medium text-gray-600 mb-1">Time (seconds)</Text>
                                    <TextInput
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={input?.time}
                                        className="border trackme-border-gray rounded-lg p-3 bg-white text-center font-medium"
                                        onChangeText={text => handleTimeChange(identifierId, idx, text)}
                                    />
                                </View>
                                
                                {/* Distance input field */}
                                <View className="flex-1">
                                    <Text className="text-xs font-medium text-gray-600 mb-1">Distance</Text>
                                    <View className="flex flex-row items-center">
                                        <TextInput
                                            placeholder="0"
                                            keyboardType="numeric"
                                            className="border trackme-border-gray rounded-lg p-3 bg-white text-center font-medium flex-1"
                                            value={input?.distance}
                                            onChangeText={text => handleDistanceChange(identifierId, idx, text)}
                                        />
                                        <Text className="text-xs font-medium text-gray-500 ml-2">m</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <View className="py-8 items-center">
                    <Text className="text-gray-500 text-sm">No entries yet</Text>
                    <Text className="text-gray-400 text-xs mt-1">Tap "Add Entry" to get started</Text>
                </View>
            )}
            
            {/* Action buttons */}
            <View className="flex flex-row justify-between mt-4 gap-x-3">
                {/* Remove button - only show if there are inputs */}
                {currentInputs[identifierId]?.length > 0 && (
                    <Pressable
                        className="flex-1 bg-gray-200 rounded-lg py-3"
                        onPress={() => {
                            setCurrentInputs(prev => {
                                const updatedGroup = prev[identifierId]?.slice(0, -1) || [];
                                return { ...prev, [identifierId]: updatedGroup };
                            });
                        }}
                    >
                        <Text className="text-gray-600 text-center font-medium">Remove Last</Text>
                    </Pressable>
                )}

                {/* Add button */}
                <Pressable 
                    className="flex-1 trackme-bg-blue rounded-lg py-3"
                    onPress={() => {
                        const existingInputs = currentInputs[identifierId] || [];
                        const updatedInputs = [...existingInputs, { time: '', distance: '' }];
                        setCurrentInputs(prev => ({ ...prev, [identifierId]: updatedInputs }));
                    }}
                >
                    <Text className="text-white text-center font-medium">
                        {currentInputs[identifierId]?.length > 0 ? 'Add Another' : 'Add Entry'}
                    </Text>
                </Pressable>
            </View>
        </>
    );
}

export default InputTracking;