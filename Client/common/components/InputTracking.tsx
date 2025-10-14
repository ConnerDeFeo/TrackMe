import { Text, TextInput, View } from "react-native";
import { Input } from "../types/inputs/Input";
import { InputType } from "../constants/Enums";
import TimeInput from "./TimeInput";
import TrackMeButton from "./display/TrackMeButton";

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
const InputTracking = ({currentInputs, setCurrentInputs, handleTimeChange, handleDistanceChange, handleRestChange}:
    {
        currentInputs: Input[],
        setCurrentInputs: (inputs: Input[]) => void,
        handleTimeChange: (idx:number, text:string)=>void,
        handleDistanceChange: (idx:number, text:string)=>void,
        handleRestChange: (idx:number, text:string)=>void,
    }
) => {   
    return(
        <>
            {/* Input entries */}
            <View>
                {Array.isArray(currentInputs) && currentInputs.map((input, idx) => (
                    <View key={idx} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <View className="flex flex-row items-center gap-x-3 justify-center">
                            {(() => {
                                switch (input.type) {
                                    case InputType.Run:
                                        return (
                                            <>
                                                {/* Time input field */}
                                                <View className="flex-1">
                                                    <Text className="text-xs font-medium text-gray-600 mb-1">
                                                        Time (seconds)
                                                    </Text>
                                                    <TextInput
                                                        placeholder="0.00"
                                                        keyboardType="numeric"
                                                        value={input?.time.toString()}
                                                        className="border trackme-border-gray rounded-lg p-3 bg-white text-center font-medium"
                                                        onChangeText={text => handleTimeChange( idx, text)}
                                                    />
                                                </View>

                                                {/* Distance input field */}
                                                <View className="flex-1">
                                                    <Text className="text-xs font-medium text-gray-600 mb-1">
                                                        Distance
                                                    </Text>
                                                    <View className="flex flex-row items-center">
                                                        <TextInput
                                                            placeholder="0"
                                                            keyboardType="numeric"
                                                            className="border trackme-border-gray rounded-lg p-3 bg-white text-center font-medium flex-1"
                                                            value={input?.distance.toString()}
                                                            onChangeText={text => handleDistanceChange(idx, text)}
                                                        />
                                                        <Text className="text-xs font-medium text-gray-500 ml-2">m</Text>
                                                    </View>
                                                </View>
                                            </>
                                        );
                                    case InputType.Rest:
                                        return (
                                            <View>
                                                <Text className="text-xs font-medium text-gray-600 mb-1">
                                                    Rest Time (seconds)
                                                </Text>
                                                <TimeInput
                                                    currSeconds={input?.restTime || 0}
                                                    handleMinutesChange={(text) => {
                                                        const totalSeconds = parseInt(text) * 60 + (input?.restTime || 0) % 60;
                                                        handleRestChange(idx, totalSeconds.toString());
                                                    }}
                                                    handleSecondsChange={(text) => {
                                                        const totalSeconds = Math.floor((input?.restTime || 0) / 60) * 60 + parseInt(text);
                                                        handleRestChange( idx, totalSeconds.toString());
                                                    }}
                                                />
                                            </View>
                                        );
                                    default:
                                        return <Text>Unsupported input type</Text>;
                                }
                            })()}
                        </View>
                    </View>
                ))}
            </View>
            {/* Action buttons */}
            <View className="flex flex-row justify-between mt-4 gap-x-3">
                {/* Remove button - only show if there are inputs */}
                {currentInputs?.length > 0 && (
                    <TrackMeButton
                        text="Remove Last"
                        className="flex-1"
                        onPress={() => {
                            const updatedGroup = [...currentInputs];
                            updatedGroup.pop();
                            setCurrentInputs(updatedGroup);
                        }}
                        gray
                    />
                )}

                {/* Add rest time button */}
                <TrackMeButton
                    text="Add Rest"
                    className="flex-1"
                    onPress={() => {
                        const safeInputs = Array.isArray(currentInputs) ? currentInputs : [];
                        const updatedInputs = [...safeInputs, { restTime: '', type: InputType.Rest }];
                        setCurrentInputs(updatedInputs as Input[]);
                    }}
                />

                {/* Add time button */}
                <TrackMeButton
                    text="Add Run"
                    className="flex-1"
                        onPress={() => {
                        const safeInputs = Array.isArray(currentInputs) ? currentInputs : [];
                        const updatedInputs = [...safeInputs, { time: '', distance: '', type: InputType.Run }];
                        setCurrentInputs(updatedInputs as Input[]);
                    }}
                />
            </View>
        </>
    );
}

export default InputTracking;