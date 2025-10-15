import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import TimeInputDisplay from "./TimeInputDisplay";
import TimeDistanceInputDisplay from "./display/TimeDistanceInputDisplay";
import TrackMeButton from "./display/TrackMeButton";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import { Input } from "../types/inputs/Input";
import { InputType } from "../constants/Enums";
import UserService from "../../services/UserService";
import DateService from "../../services/DateService";

/**
 * QuickInput component allows users to quickly log workout inputs (runs or rest periods)
 * @param setSubmittedInputs - Callback to handle submitted input data
 * @param athleteId - Optional athlete ID, defaults to current user if not provided
 */
const QuickInput = ({setSubmittedInputs, athleteId}:{setSubmittedInputs: (inputs: Input) => void, athleteId?:string}) => {
    // Flag for showing a rest input or a run time input
    const [runInput, setRunInput] = useState<boolean>(true);
    // This will either be the run time input or the seconds of the rest input
    const [currentTime, setCurrentTime] = useState<number>(0);
    // Distance in meters for run inputs
    const [currentDistance, setCurrentDistance] = useState<number>(0);

    /**
     * Handles changes to the seconds portion of time input
     * Ensures value stays within 0-59 range
     */
    const handleSecondChange = (text: string) => {
        const num = text ? parseInt(text, 10) : 0;
        if (!isNaN(num) && num < 60) {
            setCurrentTime(num + Math.floor(currentTime / 60) * 60);
        }
    }
    
    /**
     * Handles changes to the minutes portion of time input
     * Converts minutes to seconds and combines with existing seconds
     */
    const handleMinuteChange = (text: string) => {
        const num = text ? parseInt(text, 10) : 0;
        if (!isNaN(num)) {
            setCurrentTime((currentTime % 60) + num * 60);
        }
    }

    /**
     * Handles direct time changes (in seconds) for rest inputs
     */
    const handleTimeChange = (text: string) => {
        const num = text ? parseInt(text, 10) : 0;
        if (!isNaN(num)) {
            setCurrentTime(num);
        }
    }
    
    /**
     * Handles distance input changes
     */
    const handleDistanceChange = (text: string) => {
        const num = text ? parseInt(text, 10) : 0;
        if (!isNaN(num)) {
            setCurrentDistance(num);
        }
    }

    /**
     * Submits the current input to the backend
     * Creates either a Run or Rest input based on the current mode
     * Resets input fields on successful submission
     */
    const handleSubmission = async () => {
        let input: Input;
        // Create appropriate input type based on current mode
        if (runInput) {
            input = { type: InputType.Run, time: currentTime, distance: currentDistance };
        } else {
            input = { type: InputType.Rest, restTime: currentTime };
        }
        
        // Get user ID and current date for the workout entry
        const userId = athleteId ?? await UserService.getUserId();
        const date = DateService.formatDate(new Date());
        
    }

    /**
     * Toggles between Run and Rest input modes
     * Resets time when switching modes
     */
    const toggleInputType = () => {
        setRunInput(!runInput);
        setCurrentTime(0);
    }


    return (
        <View>
            {/* Toggle buttons for switching between Run and Rest input modes */}
            <View className="flex flex-row items-center justify-between mx-4">
                <TrackMeButton 
                    text="Run" 
                    onPress={toggleInputType} 
                    className="w-[50%]"
                    gray={!runInput}
                />
                <TrackMeButton 
                    text="Rest" 
                    onPress={toggleInputType} 
                    className="w-[50%]"
                    gray={runInput}
                />
            </View>
            
            {/* Input section with dynamic display based on input type */}
            <View className="flex flex-row items-center gap-x-4 p-4">
                {/* Conditional rendering: Time/Distance input for runs, Time-only input for rest */}
                <View className="flex-1">
                    {
                        runInput ?
                        <TimeDistanceInputDisplay
                            time={currentTime}
                            distance={currentDistance}
                            handleTimeChange={handleTimeChange}
                            handleDistanceChange={handleDistanceChange}
                        />
                        :
                        <TimeInputDisplay 
                            currSeconds={currentTime} 
                            handleMinutesChange={handleMinuteChange} 
                            handleSecondsChange={handleSecondChange}
                        />
                    }
                </View>
                {/* Submit button with arrow icon */}
                <Pressable className="rounded-full trackme-bg-blue mt-4" onPress={handleSubmission}>
                    <Image source={require("../../assets/images/Back.png")} className="h-12 w-12 rotate-90" />
                </Pressable>
            </View>
        </View>
    );
}

export default QuickInput;