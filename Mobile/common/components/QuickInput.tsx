import { useEffect, useState } from "react";
import { Image, Pressable, Text, TextInput, View, Keyboard  } from "react-native";
import { Input } from "../types/inputs/Input";
import { InputType } from "../constants/Enums";
import { RestInput } from "../types/inputs/RestInput";
import { TimeInput } from "../types/inputs/TimeInput";
import AvailiableInputs from "./athletes/inputs/AvailibleInputs";
import { Variables } from "../constants/Variables";
import LeftInputTextFeild from "./athletes/inputs/LeftInputTextFeild";

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
     * Submits the current input to the backend
     * Creates either a Run or Rest input based on the current mode
     * Resets input fields on successful submission
     */
    const handleSubmission = async () => {
        if(inputType==InputType.Run && (currentTimeDistanceInput.distance === 0 || currentTimeDistanceInput.time === "")) return; // Prevent adding run inputs with 0 distance or time
        if(inputType==InputType.Rest && currentRestInput.restTime === 0) return; // Prevent adding rest inputs with 0 time
        // Pass the created input to the parent component via callback
        if(inputType==InputType.Run){
            setCurrentTimeDistanceInput(prev=>({...prev, time: ""}));
            handleInputAddition(currentTimeDistanceInput);
        }
        else {
            setCurrentRestInput({type: InputType.Rest, restTime: 0});
            handleInputAddition(currentRestInput);
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
                        handleDistanceChange={handleDistanceChange}
                        handleMinuteChange={handleMinuteChange}
                    />
                    {inputType===InputType.Rest && <Text className="font-bold text-lg mt-4">:</Text>}
                    <View className="flex-1">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                            {Variables.inputs.quickInputs.rightInputTextFeild.headers[inputType]}
                        </Text>
                        <TextInput
                            placeholder={Variables.inputs.quickInputs.rightInputTextFeild.placeHolders[inputType]}
                            keyboardType="decimal-pad"
                            value={inputType===InputType.Run ? 
                                currentTimeDistanceInput.time
                                : (currentRestInput.restTime % 60 === 0 ? '' : (currentRestInput.restTime % 60).toString())
                            }
                            className={`border trackme-border-gray rounded-lg p-3 bg-white font-medium ${inputType===InputType.Note ? 'pl-5' : 'text-center'}`}
                            onChangeText={text => inputType===InputType.Run ? handleTimeChange(text) : handleSecondChange(text)}
                        />
                    </View>
                </View>
            </View>
            {/* Submit button with arrow icon */}
            <Pressable className="rounded-full trackme-bg-blue mt-4" onPress={handleSubmission}>
                <Image source={require("../../assets/images/Back.png")} className="h-12 w-12 rotate-90" />
            </Pressable>
        </View>
    );
}

export default QuickInput;