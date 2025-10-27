import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Input } from "../../../types/inputs/Input";
import { InputType } from "../../../constants/Enums";
import { RestInput } from "../../../types/inputs/RestInput";
import { TimeInput } from "../../../types/inputs/TimeInput";
import LeftInputTextFeild from "./LeftInputTextFeild";
import RightInputTextFeild from "./RightInputTextFeild";
import { NoteInput } from "../../../types/inputs/NoteInputs";

/**
 * QuickInput component allows users to quickly log workout inputs (runs or rest periods)
 * @param handleInputAddition - Callback to handle added input data
 */
const QuickInput = ({handleInputAddition, inputType, className}:
    {
        handleInputAddition: (inputs: Input) => void, 
        inputType: InputType,
        className?: string,
    }
) => {
    // This will either be the run time input or the seconds of the rest input
    const [currentTimeDistanceInput, setCurrentTimeDistanceInput] = useState<TimeInput>({type: InputType.Run, time: "", distance: 0});
    // Distance input for runs
    const [currentRestInput, setCurrentRestInput] = useState<RestInput>({type: InputType.Rest, restTime: 0});
    // note input for the note type
    const [currentNoteInput, setCurrentNoteInput] = useState<NoteInput>({type: InputType.Note, note: ""});
    // Flag for which input is focused
    const [leftFocused, setLeftFocused] = useState<boolean>(false);

    /**
     * Handles changes to the seconds portion of time input
     * Ensures value stays within 0-59 range
     */
    const handleSecondChange = (text: string) => {
        const num = text ? parseInt(text, 10) : 0;
        if (!isNaN(num) && num < 60) {
            setCurrentRestInput({ ...currentRestInput, restTime: num + Math.floor(currentRestInput.restTime / 60) * 60 });
        }
    }
    
    /**
     * Handles changes to the minutes portion of time input
     * Converts minutes to seconds and combines with existing seconds
     */
    const handleMinuteChange = (text: string) => {
        const num = text ? parseInt(text, 10) : 0;
        if (!isNaN(num)) {
            setCurrentRestInput({ ...currentRestInput, restTime: (currentRestInput.restTime % 60) + num * 60 });
        }
    }

    /**
     * Handles direct time changes (in seconds) for rest inputs
     */
    const handleTimeChange = (text: string) => {
        if (!isNaN(Number(text)) || text === '') {
            setCurrentTimeDistanceInput({ ...currentTimeDistanceInput, time: text });
        }
    }
    
    /**
     * Handles distance input changes
     */
    const handleDistanceChange = (text: string) => {
        const num = text ? parseInt(text, 10) : 0;
        if (!isNaN(num)) {
            setCurrentTimeDistanceInput({ ...currentTimeDistanceInput, distance: num });
        }
    }

    /**
     * Handles note input changes
     */
    const handleNoteChange = (text: string) => {
        setCurrentNoteInput(prev => ({ ...prev, note: text }));
    }

    /**
     * Creates either a Run or Rest input based on the current mode
     * Resets input fields on successful submission
     */
    const handleAddition = async () => {
        if(inputType==InputType.Run && (currentTimeDistanceInput.distance === 0 || currentTimeDistanceInput.time === "")) return; // Prevent adding run inputs with 0 distance or time
        if(inputType==InputType.Rest && currentRestInput.restTime === 0) return; // Prevent adding rest inputs with 0 time
        // Pass the created input to the parent component via callback
        switch(inputType) {
            case InputType.Run:
                setCurrentTimeDistanceInput(prev=>({...prev, time: ""}));
                handleInputAddition(currentTimeDistanceInput);
                break;
            case InputType.Rest:
                setCurrentRestInput({type: InputType.Rest, restTime: 0});
                handleInputAddition(currentRestInput);
                break;
            case InputType.Note:
                setCurrentNoteInput({type: InputType.Note, note: ""});
                handleInputAddition(currentNoteInput);
                return;
            default:
                return;
        }
    }
    return (
        // Input section with dynamic display based on input type
        <View className={`flex flex-row items-center gap-x-4 ${className}`}>
            {/* Conditional rendering: Time/Distance input for runs, Time-only input for rest */}
            <View className="flex-1">
                <View className="flex-row items-center gap-x-2 justify-between">
                    <LeftInputTextFeild
                        inputType={inputType}
                        currentTimeDistanceInput={currentTimeDistanceInput}
                        currentRestInput={currentRestInput}
                        currentNoteInput={currentNoteInput}
                        handleDistanceChange={handleDistanceChange}
                        handleMinuteChange={handleMinuteChange}
                        handleNoteChange={handleNoteChange}
                        isFocused={leftFocused}
                        onFocus={() => setLeftFocused(true)}
                    />
                    {inputType===InputType.Rest && <Text className="font-bold text-lg mt-4">:</Text>}
                    <RightInputTextFeild
                        inputType={inputType}
                        currentTimeDistanceInput={currentTimeDistanceInput}
                        currentRestInput={currentRestInput}
                        currentNoteInput={currentNoteInput}
                        handleTimeChange={handleTimeChange}
                        handleSecondChange={handleSecondChange}
                        handleNoteChange={handleNoteChange}
                        isFocused={!leftFocused}
                        onFocus={() => setLeftFocused(false)}
                    />
                </View>
            </View>
            {/* Submit button with arrow icon */}
            <Pressable className="rounded-full trackme-bg-blue mt-4" onPress={handleAddition}>
                <Image source={require("../../../../assets/images/Back.png")} className="h-12 w-12 rotate-90" />
            </Pressable>
        </View>
    );
}

export default QuickInput;