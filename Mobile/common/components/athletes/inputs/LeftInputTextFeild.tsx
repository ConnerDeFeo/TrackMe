import { Image, Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { InputType } from "../../../constants/Enums";
import AvailiableInputs from "./AvailibleInputs";
import { useEffect, useState } from "react";
import { Variables } from "../../../constants/Variables";
import { RestInput } from "../../../types/inputs/RestInput";
import { NoteInput } from "../../../types/inputs/NoteInputs";

const LeftInputTextField = ({inputType, currentTimeDistanceInput, currentRestInput, currentNoteInput, 
    handleDistanceChange, handleMinuteChange, handleNoteChange, isFocused, onFocus}:
{   
    inputType: InputType, 
    currentTimeDistanceInput: {type: InputType.Run, time: string, distance: number}, 
    currentRestInput: RestInput,
    currentNoteInput: NoteInput,
    handleDistanceChange: (text:string)=>void,
    handleMinuteChange: (text:string)=>void,
    handleNoteChange: (text:string)=>void,
    isFocused?: boolean,
    onFocus?: ()=>void,
}
) => {
    const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

    const value = inputType==InputType.Run ? 
        (currentTimeDistanceInput.distance === 0 ? "" : currentTimeDistanceInput.distance.toString()) 
        : inputType === InputType.Rest ? (Math.floor(currentRestInput.restTime / 60) === 0 ? '' : Math.floor(currentRestInput.restTime / 60).toString())
        : currentNoteInput?.note;

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

    const handleChange = (text: string) => {
        switch(inputType) {
            case InputType.Run:
                handleDistanceChange(text);
                break;
            case InputType.Rest:
                handleMinuteChange(text);
                break;
            case InputType.Note:
                handleNoteChange(text);
                break;
            default:
                break;
        }
    }

    return ( (inputType!==InputType.Note || isFocused) &&
        <View className="flex-1">
            <Text className="text-xs font-medium text-gray-600 mb-1">
                {Variables.inputs.quickInputs.LeftInputTextField.headers[inputType]}
            </Text>
            {/* Container for distance input and unit */}
            <View className="flex flex-row items-center">
                <View className="border trackme-border-gray rounded-lg flex-1 flex-row relative">
                    <TextInput
                        placeholder={Variables.inputs.quickInputs.LeftInputTextField.placeHolders[inputType]}
                        className={`rounded-lg bg-white font-medium flex-1 p-3 ${inputType===InputType.Note ? '' : 'text-center'}`}
                        value={value}
                        onChangeText={handleChange}
                        onFocus={onFocus}
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