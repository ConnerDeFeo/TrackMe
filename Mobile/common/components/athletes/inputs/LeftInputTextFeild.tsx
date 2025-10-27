import { Image, Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { InputType } from "../../../constants/Enums";
import AvailiableInputs from "./AvailibleInputs";
import { useEffect, useState } from "react";
import { Variables } from "../../../constants/Variables";

const LeftInputTextField = ({inputType, currentTimeDistanceInput, currentRestInput, handleDistanceChange, handleMinuteChange}:
{   
    inputType: InputType, 
    currentTimeDistanceInput: {type: InputType.Run, time: string, distance: number}, 
    currentRestInput: {type: InputType.Rest, restTime: number},
    handleDistanceChange: (text:string)=>void,
    handleMinuteChange: (text:string)=>void,
}
) => {
    const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

    // Listen for keyboard hide to close dropdown
    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setOptionsOpen(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    return (inputType!==InputType.Note &&
        <View className="flex-1">
            <Text className="text-xs font-medium text-gray-600 mb-1">
                {inputType==InputType.Run ? "Distance (meters)" : "Minutes"}
            </Text>
            {/* Container for distance input and unit */}
            <View className="flex flex-row items-center">
                <View className="border trackme-border-gray rounded-lg flex-1 flex-row relative">
                    <TextInput
                        placeholder={inputType==InputType.Run ? "0" : "Mins"}
                        keyboardType="numeric"
                        className="rounded-lg bg-white text-center font-medium flex-1"
                        value={inputType==InputType.Run ? 
                            (currentTimeDistanceInput.distance === 0 ? "" : currentTimeDistanceInput.distance.toString()) 
                            : (Math.floor(currentRestInput.restTime / 60) === 0 ? '' : Math.floor(currentRestInput.restTime / 60).toString())
                        }
                        onChangeText={text => inputType==InputType.Run ? handleDistanceChange(text) : handleMinuteChange(text)}
                    />
                    {inputType===InputType.Run &&
                        <>
                            <Pressable
                                className="border-l border-gray-300 px-2 flex justify-center items-center" 
                                onPressIn={() => setOptionsOpen(prev=>!prev)}
                            >
                                <Image source={require("../../../../assets/images/Back.png")} className="h-6 w-6 rotate-90" />
                            </Pressable>
                            <AvailiableInputs
                                isOpen={optionsOpen}
                                onClose={() => setOptionsOpen(false)}
                                options={Variables.distanceOptions}
                                setSelected={(value:string)=>handleDistanceChange(value)}
                            />
                        </>
                    }
                </View>
            </View>
        </View>

    );
}

export default LeftInputTextField;