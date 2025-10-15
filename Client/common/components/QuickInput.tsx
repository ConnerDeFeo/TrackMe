import { useState } from "react";
import { View } from "react-native";
import TimeInputDisplay from "./TimeInputDisplay";

const QuickInput = ({athleteId}:{athleteId?:string}) => {
    // Flag for showing a rest input or a run time input
    const [runInput, setRunInput] = useState<boolean>(true);
    // This will either be the run time input or the seconds of the rest input
    const [currentTime, setCurrentTime] = useState<number>(0);

    const handleSecondChange = (text: string) => {}
    const handleMinuteChange = (text: string) => {}


    return (
        <View>
            {/* Header for either a rest or time distance based input */}
            {
                runInput ?
                <></>
                :
                <TimeInputDisplay 
                    currSeconds={currentTime} 
                    handleMinutesChange={handleMinuteChange} 
                    handleSecondsChange={handleSecondChange}
                />
            }
        </View>
    );
}

export default QuickInput;