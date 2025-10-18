import { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Input } from "../types/inputs/Input";
import { InputType } from "../constants/Enums";
import { RestInput } from "../types/inputs/RestInput";
import { TimeInput } from "../types/inputs/TimeInput";

/**
 * QuickInput component allows users to quickly log workout inputs (runs or rest periods)
 * @param handleInputAddition - Callback to handle added input data
 */
const QuickInput = ({handleInputAddition, runInput, className}:
    {
        handleInputAddition: (inputs: Input) => void, 
        runInput: boolean,
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
        if(runInput && (currentTimeDistanceInput.distance === 0 || currentTimeDistanceInput.time === "")) return; // Prevent adding run inputs with 0 distance or time
        if(!runInput && currentRestInput.restTime === 0) return; // Prevent adding rest inputs with 0 time
        // Pass the created input to the parent component via callback
        if(runInput){
            setCurrentTimeDistanceInput({type: InputType.Run, time: "", distance: 0});
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
                    <View className="flex-1">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                            {runInput ? "Time (seconds)" : "Minutes"}
                        </Text>
                        <TextInput
                            placeholder={runInput ? "0.00" : "Mins"}
                            keyboardType="decimal-pad"
                            value={runInput ? 
                                currentTimeDistanceInput.time
                                : (Math.floor(currentRestInput.restTime / 60) === 0 ? '' : Math.floor(currentRestInput.restTime / 60).toString())
                            }
                            className="border trackme-border-gray rounded-lg p-3 bg-white text-center font-medium"
                            onChangeText={text => runInput ? handleTimeChange(text) : handleMinuteChange(text)}
                        />
                    </View>
                    {!runInput && <Text className="font-bold text-lg mt-4">:</Text>}
                    {/* Distance input field with unit label */}
                    <View className="flex-1">
                        <Text className="text-xs font-medium text-gray-600 mb-1">
                            {runInput ? "Distance" : "Seconds"}
                        </Text>
                        {/* Container for distance input and unit */}
                        <View className="flex flex-row items-center">
                            <TextInput
                                placeholder={runInput ? "0" : "Secs"}
                                keyboardType="numeric"
                                className="border trackme-border-gray rounded-lg p-3 bg-white text-center font-medium flex-1"
                                value={runInput ? 
                                    (currentTimeDistanceInput.distance === 0 ? "" : currentTimeDistanceInput.distance.toString()) 
                                    : (currentRestInput.restTime % 60 === 0 ? '' : (currentRestInput.restTime % 60).toString())
                                }
                                onChangeText={text => runInput ? handleDistanceChange(text) : handleSecondChange(text)}
                            />
                            {/* Unit label for distance (meters) */}
                            {runInput && <Text className="text-xs font-medium text-gray-500 ml-2">m</Text>}
                        </View>
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