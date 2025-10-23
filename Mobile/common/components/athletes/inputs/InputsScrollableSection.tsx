import { Pressable, Text } from "react-native";
import { ScrollView, View } from "react-native";
import { InputType } from "../../../constants/Enums";
import InputDisplay from "../../display/input/InputDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import AthleteWorkoutService from "../../../../services/AthleteWorkoutService";
import { Input } from "../../../types/inputs/Input";

//Scrollable input section for the inputs page
const InputsScrollableSection = (
    {scrollRef, pendingInputs, selectedSubmittedInputs, setSelectedSubmittedInputs, selectedPendingInputs, setSelectedPendingInputs, submittedInputs, setSubmittedInputs, date}:
    {
        scrollRef: React.RefObject<ScrollView | null>, 
        pendingInputs: Input[], 
        selectedSubmittedInputs: {inputId:number, type: InputType}[], 
        setSelectedSubmittedInputs: React.Dispatch<React.SetStateAction<{inputId:number, type: InputType}[]>>,
        selectedPendingInputs: Set<number>, 
        setSelectedPendingInputs: React.Dispatch<React.SetStateAction<Set<number>>>,
        submittedInputs: Input[],
        setSubmittedInputs: React.Dispatch<React.SetStateAction<Input[]>>,
        date: string
    }
) => {
    // Fetch previously submitted workout inputs from the server
    const fetchSubmittedInputs = useCallback(async () => {
        const resp = await AthleteWorkoutService.viewWorkoutInputs(date);
        if (resp.ok) {
            const inputs = await resp.json();
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
                <Text className="text-2xl font-bold text-gray-800 mb-2">Submitted Entries</Text>
                <View className="gap-y-1 pb-4">
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
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                    Pending Entries (NOT SUBMITTED)
                </Text>
                {pendingInputs.length > 0 ? (
                    pendingInputs.map((input, idx) => (
                        <Pressable key={idx} onPress={() => {
                            // Toggle selection state for pending inputs
                            if (selectedPendingInputs.has(idx)) {
                                setSelectedPendingInputs(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(idx);
                                    return newSet;
                                });
                            } else {
                                setSelectedPendingInputs(prev => new Set(prev).add(idx));
                            }
                        }}>
                            <InputDisplay input={input} selected={selectedPendingInputs.has(idx)} />
                        </Pressable>
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