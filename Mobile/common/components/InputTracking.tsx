import { Text, TextInput, View } from "react-native";
import { Input } from "../types/inputs/Input";
import { InputType } from "../constants/Enums";
import TrackMeButton from "./display/TrackMeButton";
import TimeInputDisplay from "./display/TimeInputDisplay";
import { RestInput } from "../types/inputs/RestInput";
import TimeDistanceInputDisplay from "./display/TimeDistanceInputDisplay";

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
    const handleMinuteChange = (input: RestInput, text: string) => {
        // If minutes input is cleared, return just the seconds portion
        const value = text === "" ? 0 : parseInt(text);
        const totalSeconds = value * 60 + (input?.restTime || 0) % 60;
        return totalSeconds.toString();
    }
    const handleSecondChange = (input: RestInput, text: string) => {
        const value = text === "" ? 0 : parseInt(text);
        // If seconds input is cleared, return just the minutes portion
        const totalSeconds = Math.floor((input?.restTime || 0) / 60) * 60 + value;
        return totalSeconds.toString();
    }
    return(
        <>
            {/* Input entries */}
            <View>
                {Array.isArray(currentInputs) && currentInputs.map((input, idx) => (
                    <View key={idx} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        {(() => {
                            switch (input.type) {
                                case InputType.Run:
                                    return (
                                        <TimeDistanceInputDisplay
                                            time={input.time}
                                            distance={input.distance}
                                            handleTimeChange={(text) => handleTimeChange(idx, text)}
                                            handleDistanceChange={(text) => handleDistanceChange(idx, text)}
                                        />
                                    );
                                case InputType.Rest:
                                    return (
                                            <TimeInputDisplay
                                                currSeconds={input?.restTime || 0}
                                                handleMinutesChange={(text) => {
                                                    const totalSeconds = handleMinuteChange(input, text);
                                                    handleRestChange(idx, totalSeconds);
                                                }}
                                                handleSecondsChange={(text) => {
                                                    const totalSeconds = handleSecondChange(input, text);
                                                    handleRestChange(idx, totalSeconds);
                                                }}
                                            />
                                    );
                                default:
                                    return <Text>Unsupported input type</Text>;
                            }
                        })()}
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