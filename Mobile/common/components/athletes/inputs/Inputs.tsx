import { useEffect, useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Pressable, ScrollView, Text, View, Keyboard } from "react-native";
import Toast from "react-native-toast-message";
import DateService from "../../../../services/DateService";
import usePersistentState from "../../../hooks/usePersistentState";
import { Input } from "../../../types/inputs/Input";
import { InputType } from "../../../constants/Enums";
import { useWorkoutGroup } from "../../../hooks/useWorkoutGroup";
import { useNavigation } from "@react-navigation/native";
import UserService from "../../../../services/UserService";
import AthleteWorkoutService from "../../../../services/AthleteWorkoutService";
import InputsScrollableSection from "./InputsScrollableSection";
import TrackMeButton from "../../display/TrackMeButton";
import QuickInput from "./QuickInput";
import { RestInput } from "../../../types/inputs/RestInput";

//Page where athletes input times
const Inputs = ({date, workoutGroupButton }:{date:string, workoutGroupButton?: boolean})=>{
    // Track current input values for each given group { groupId : [time/distance, time/distance] }
    const [pendingInputs, setPendingInputs] = usePersistentState<Input[]>('current', []);
    // Currently selected pending inputs for deletion
    const [selectedPendingInputs, setSelectedPendingInputs] = useState<Set<number>>(new Set());
    // Currently selected submitted inputs for deletion
    const [submittedInputs, setSubmittedInputs] = useState<Input[]>([]);
    // Currently selected submitted inputs for deletion
    const [selectedSubmittedInputs, setSelectedSubmittedInputs] = useState<{inputId:number, type: InputType}[]>([]);
    // Flag for showing a rest input or a run time input
    const [inputType, setInputType] = useState<InputType>(InputType.Run);
    const { workoutGroup } = useWorkoutGroup();
    // Store previously submitted workout inputs organized by date and group
    const scrollRef = useRef<ScrollView | null>(null);
    const navigation = useNavigation<any>();
    const inDeleteMode = selectedPendingInputs.size > 0 || selectedSubmittedInputs.length > 0;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                scrollRef.current?.scrollToEnd({animated: true});
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);
    const handleInputAddition = async (input:Input) => {
        if (input.type === InputType.Run && (input.distance === 0 || input.time === "")) return; // Prevent adding run inputs with 0 distance or time
        if (input.type === InputType.Rest && input.restTime === 0) return; // Prevent adding rest inputs with 0 time
        if (input.type === InputType.Note && input.note?.trim() === "") return; // Prevent adding empty notes
        setPendingInputs(prev => {
            if (prev.length > 0 && prev[prev.length - 1].type === InputType.Rest && input.type === InputType.Rest) {
                // Combine consecutive rest inputs
                const updated = [...prev];
                const lastRestInput = updated[updated.length - 1] as RestInput;
                lastRestInput.restTime += input.restTime;
                return updated;
            }
           return [...prev, input];
        });
        scrollRef.current?.scrollToEnd({animated: true});
    }
    const handleInputSubmission = async () => {
        const userId = await UserService.getUserId();

        let inputsToSend = [...pendingInputs];
        while (inputsToSend.length > 0 && inputsToSend[inputsToSend.length - 1]?.type === InputType.Rest) {
            inputsToSend.pop();
        }

        if (userId) {
            // Combine group members and current user into one list of athlete IDs
            const athletes = [...workoutGroup.map(member => member.id), userId];

            // Send the inputs for this group and date
            const resp = await AthleteWorkoutService.inputTimes(
                athletes,
                date,
                inputsToSend
            );

            // On success, reset only this group's inputs and refresh parent via onSubmit
            if (resp.ok) {
                Toast.show({text1: 'Inputs submitted successfully!'});
                setPendingInputs([]);
                const returnedInputs = await resp.json();
                setSubmittedInputs(prev => [...prev, ...returnedInputs]);
            }
        }
    };
    const handleInputRemoval = async () => {
        if (selectedSubmittedInputs.length > 0) {
            const resp = await AthleteWorkoutService.removeInputs(selectedSubmittedInputs);
            if (resp.ok) {
                // Remove from local state
                setSubmittedInputs(prev => prev.filter(input => !selectedSubmittedInputs.some(selected => selected.inputId === input.inputId && selected.type === input.type)));
                // Reset selection and refresh parent
                setSelectedSubmittedInputs([]);
            }
        };
        if (selectedPendingInputs.size > 0) {
            setPendingInputs(prev => prev.filter((_, idx) => !selectedPendingInputs.has(idx)));
            setSelectedPendingInputs(new Set());
        }
    };
    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-white"
            behavior="padding"
            keyboardVerticalOffset={100}
        >
            {/* Submitted Entries Section - Scrollable */}
            <InputsScrollableSection 
                scrollRef={scrollRef} 
                pendingInputs={pendingInputs} 
                selectedSubmittedInputs={selectedSubmittedInputs}
                setSelectedSubmittedInputs={setSelectedSubmittedInputs}
                selectedPendingInputs={selectedPendingInputs} 
                setSelectedPendingInputs={setSelectedPendingInputs} 
                submittedInputs={submittedInputs} 
                setSubmittedInputs={setSubmittedInputs}
                date={date}
            />

            {/* Input Tracking Section - Fixed at Bottom */}
            <View className="border-t border-gray-200 px-4 py-4">
                {/* Display current workout partners if any */}
                {workoutGroup.length > 0 && (
                    <ScrollView className="py-3 pl-2 rounded-lg mb-4 border trackme-border-gray" horizontal>
                        <View className="flex flex-row gap-2 pr-4">
                            {workoutGroup.map((member, idx) => (
                                <View
                                    key={idx}
                                    className="bg-white border border-gray-200 rounded-full px-3 py-1"
                                >
                                    <Text className="text-sm font-medium text-gray-700">
                                        {member.username}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
                
                {/* Toggle buttons for switching between Run and Rest input modes */}
                <View className="flex flex-row items-center justify-between mx-2">
                    <View className="flex flex-row items-center w-[55%]">
                        <View className="flex flex-row items-center gap-x-1">
                            <TrackMeButton
                                text="Run" 
                                onPress={()=> setInputType(InputType.Run)} 
                                width={60}
                                gray={inputType!==InputType.Run}
                            />
                            <TrackMeButton 
                                text="Rest" 
                                onPress={()=> setInputType(InputType.Rest)} 
                                width={60}
                                gray={inputType!==InputType.Rest}
                            />
                            <TrackMeButton 
                                text="Note" 
                                onPress={()=> setInputType(InputType.Note)} 
                                width={60}
                                gray={inputType!==InputType.Note}
                            />
                        </View>
                        {workoutGroupButton && 
                            <Pressable className="ml-4 bg-blue-100 rounded-full p-1" onPress={() => navigation.navigate("CreateWorkoutGroup")}>
                                <Image source={require('../../../../assets/images/TwoRunners.png')} className="w-10 h-10" />
                            </Pressable>
                        }
                    </View>
                    <TrackMeButton 
                        text={inDeleteMode ? "Remove" : "Submit"} 
                        onPress={inDeleteMode ? handleInputRemoval : handleInputSubmission} 
                        className="w-24"
                        red={inDeleteMode}
                    />
                </View>
                <QuickInput
                    handleInputAddition={handleInputAddition} 
                    inputType={inputType}
                    className="py-4 mx-2"
                />
            </View>
        </KeyboardAvoidingView>
    );
}

export default Inputs;