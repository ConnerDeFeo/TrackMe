import { Pressable, Text } from "react-native";
import { ScrollView, View } from "react-native";
import { InputType } from "../../../constants/Enums";
import InputDisplay from "../../display/input/InputDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import AthleteWorkoutService from "../../../../services/AthleteWorkoutService";
import { Input } from "../../../types/inputs/Input";
import TextButton from "../../display/TextButton";

//Scrollable input section for the inputs page
const InputsScrollableSection = ({scrollRef, pendingInputs, setPendingInputs, submittedInputs, setSubmittedInputs}:
    {
        scrollRef: React.RefObject<ScrollView | null>, 
        pendingInputs: Input[], 
        setPendingInputs: React.Dispatch<React.SetStateAction<Input[]>>,
        submittedInputs: Input[],
        setSubmittedInputs: React.Dispatch<React.SetStateAction<Input[]>>
    }
) => {
    const [selectedSubmittedInputs, setSelectedSubmittedInputs] = useState<{inputId:number, type: InputType}[]>([]);
    // Fetch previously submitted workout inputs from the server
    const fetchSubmittedInputs = useCallback(async () => {
        const resp = await AthleteWorkoutService.viewWorkoutInputs();
        if (resp.ok) {
            const inputs = await resp.json();
            console.log("LAST INPUT: ",inputs[inputs.length - 1]);
            setSubmittedInputs(inputs);
        }
        else{
            setSubmittedInputs([]);
        }
    }, []);

    // Fetch submitted inputs on component mount
    useFocusEffect(
        useCallback(() => {
            fetchSubmittedInputs();
        }, [fetchSubmittedInputs])
    );
    const handleInputRemoval = async () => {
        const resp = await AthleteWorkoutService.removeInputs(selectedSubmittedInputs);
        if (resp.ok) {
            // Reset selection and refresh parent
            setSelectedSubmittedInputs([]);
            fetchSubmittedInputs();
        }
    };

    const handleSubmittedInputSelection = (type: InputType, inputId?: number) => {
        if(!inputId) return;
        const alreadySelected = selectedSubmittedInputs.some(selected => selected.inputId === inputId && selected.type === type);
        // Toggle selection state
        setSelectedSubmittedInputs(prev =>
            alreadySelected
                ? prev.filter(selected => !(selected.inputId === inputId && selected.type === type))
                : [...prev, {inputId: inputId, type: type}] as {inputId: number, type: InputType}[]
        );
    };

    return(
        <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{paddingBottom: 15}} ref={scrollRef} keyboardShouldPersistTaps="handled">
            <View className="mb-2">
                <View className="flex flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-800">
                        Submitted Entries
                    </Text>
                    {selectedSubmittedInputs.length > 0 && <TextButton text={`Remove(${selectedSubmittedInputs.length})`} onPress={handleInputRemoval} red/>}
                </View>
                <View className="gap-y-1 pb-4 pt-2">
                    {submittedInputs.length > 0 ? (
                        submittedInputs.map((input, idx) => (
                            <Pressable key={idx} onPress={() => handleSubmittedInputSelection(input.type, input.inputId)} >
                                <InputDisplay input={input} selected={selectedSubmittedInputs.some(selected => selected.inputId === input.inputId && selected.type === input.type)} />
                            </Pressable>
                        ))
                        ) : (
                        <Text className="text-gray-500 text-center py-4">
                            No entries submitted
                        </Text>
                    )}
                </View>
            </View>
            <View className="mb-12">
                <Text className="text-2xl font-bold text-gray-800">
                    Pending Entries (NOT SUBMITTED)
                </Text>
                {pendingInputs.length > 0 ? (
                    pendingInputs.map((input, idx) => (
                        <InputDisplay key={idx} input={input} />
                    ))
                    ) : (
                    <Text className="text-gray-500 text-center py-4">
                        No pending entries
                    </Text>
                )}
            </View>
        </ScrollView>
    );
}

export default InputsScrollableSection;