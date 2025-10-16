import { useRef } from "react";
import { TextInput, Text, View } from "react-native";

/**
 * TimeDistanceInputDisplay Component
 * 
 * A form component that displays two input fields for entering time (in seconds) 
 * and distance (in meters). Used for tracking workout or activity metrics.
 * 
 * @param input - Object containing time and distance values
 * @param handleTimeChange - Callback function triggered when time input changes
 * @param handleDistanceChange - Callback function triggered when distance input changes
 * @param idx - Index identifier for the input pair
 */
const TimeDistanceInputDisplay = ({ time, distance, handleTimeChange, handleDistanceChange, onFocus }:
    {
        time: number,
        distance: number,
        handleTimeChange: (text: string) => void, 
        handleDistanceChange: (text: string) => void,
        onFocus?: () => void
    }
)=>{
    const timeRef = useRef<TextInput>(null);
    const distanceRef = useRef<TextInput>(null);

    const handleTimeDistanceInputEnterKey = (current: "time" | "distance") => {
        if (current === "time") {
            if (distance == 0) {
                distanceRef.current?.focus();
            }
        } else {
            if (time == 0) {
                timeRef.current?.focus();
            }
        }
    }

    return(
        <View className="flex flex-row justify-between items-center gap-x-3">
            {/* Time input field */}
            <View className="flex-1">
                <Text className="text-xs font-medium text-gray-600 mb-1">
                    Time (seconds)
                </Text>
                <TextInput
                    ref={timeRef} 
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={time == 0 ? "" : time.toString()}
                    className="border trackme-border-gray rounded-lg p-3 bg-white text-center font-medium"
                    onChangeText={text => handleTimeChange(text)}
                    returnKeyType="next"
                    onSubmitEditing={() => handleTimeDistanceInputEnterKey("time")}
                    onFocus={onFocus}
                />
            </View>

            {/* Distance input field with unit label */}
            <View className="flex-1">
                <Text className="text-xs font-medium text-gray-600 mb-1">
                    Distance
                </Text>
                {/* Container for distance input and unit */}
                <View className="flex flex-row items-center">
                    <TextInput
                        ref={distanceRef}
                        placeholder="0"
                        keyboardType="numeric"
                        className="border trackme-border-gray rounded-lg p-3 bg-white text-center font-medium flex-1"
                        value={distance == 0 ? "" : distance.toString()}
                        onChangeText={text => handleDistanceChange(text)}
                        returnKeyType="done"
                        onSubmitEditing={() => handleTimeDistanceInputEnterKey("distance")}
                        onFocus={onFocus}
                    />
                    {/* Unit label for distance (meters) */}
                    <Text className="text-xs font-medium text-gray-500 ml-2">m</Text>
                </View>
            </View>
        </View>
    );
}

export default TimeDistanceInputDisplay;