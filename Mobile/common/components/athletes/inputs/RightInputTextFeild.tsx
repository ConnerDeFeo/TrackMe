import { Text, TextInput, View } from "react-native";
import { Variables } from "../../../constants/Variables";
import { InputType } from "../../../constants/Enums";
import { NoteInput } from "../../../types/inputs/NoteInputs";
import { RestInput } from "../../../types/inputs/RestInput";

const RightInputTextFeild = ({inputType, currentTimeDistanceInput, currentRestInput, currentNoteInput, 
    handleTimeChange, handleSecondChange, handleNoteChange, isFocused, onFocus}:
    {
        inputType: InputType,
        currentTimeDistanceInput: {type: InputType, time: string, distance: number},
        currentRestInput: RestInput,
        currentNoteInput: NoteInput,
        handleTimeChange: (text: string) => void,
        handleSecondChange: (text: string) => void,
        handleNoteChange: (text:string)=>void,
        isFocused?: boolean,
        onFocus?: ()=>void,
    }
) => {
    const value = inputType===InputType.Run ? 
        currentTimeDistanceInput.time
        : inputType === InputType.Rest ? (currentRestInput.restTime % 60 === 0 ? '' : (currentRestInput.restTime % 60).toString())
        : currentNoteInput?.note;

    const handleChange = (text: string) => {
        switch(inputType) {
            case InputType.Run:
                handleTimeChange(text);
                break;
            case InputType.Rest:
                handleSecondChange(text);
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
                {Variables.inputs.quickInputs.rightInputTextFeild.headers[inputType]}
            </Text>
            <TextInput
                placeholder={Variables.inputs.quickInputs.rightInputTextFeild.placeHolders[inputType]}
                keyboardType="decimal-pad"
                value={value}
                onFocus={onFocus}
                className={`border trackme-border-gray rounded-lg p-3 bg-white font-medium ${inputType===InputType.Note ? 'pl-5' : 'text-center'}`}
                onChangeText={handleChange}
            />
        </View>
    );
}

export default RightInputTextFeild;