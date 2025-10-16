import { useRef, useState } from "react";
import usePersistentState from "../../common/hooks/usePersistentState";
import { useNavigation } from "@react-navigation/native";
import { Input } from "../../common/types/inputs/Input";
import { useWorkoutGroup } from "../../common/hooks/useWorkoutGroup";
import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native";
import QuickInput from "../../common/components/QuickInput";
import InputsScrollableSection from "../../common/components/athletes/inputs/InputsScrollableSection";
import TrackMeButton from "../../common/components/display/TrackMeButton";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import DateService from "../../services/DateService";
import UserService from "../../services/UserService";
import { InputType } from "../../common/constants/Enums";

//Page where athletes input times
const Inputs = ()=>{
    // Track current input values for each given group { groupId : [time/distance, time/distance] }
    const [pendingInputs, setPendingInputs] = usePersistentState<Input[]>('current', []);
    const [submittedInputs, setSubmittedInputs] = useState<Input[]>([]);
    // Flag for showing a rest input or a run time input
    const [runInput, setRunInput] = useState<boolean>(true);
    const { workoutGroup } = useWorkoutGroup();
    // Store previously submitted workout inputs organized by date and group
    const scrollRef = useRef<ScrollView | null>(null);
    const navigation = useNavigation<any>();


    const handleInputAddition = async (input:Input) => {
        if (input.type === InputType.Run && (input.distance === 0 || input.time === 0)) return; // Prevent adding run inputs with 0 distance or time
        if (input.type === InputType.Rest && input.restTime === 0) return; // Prevent adding rest inputs with 0 time
        setPendingInputs(prev => [...prev, input]);
        scrollRef.current?.scrollToEnd({animated: true});
    }

    const handleInputSubmission = async () => {
        const date = DateService.formatDate(new Date());
        const userId = await UserService.getUserId();

        if (userId) {
            // Combine group members and current user into one list of athlete IDs
            const athletes = [...workoutGroup.map(member => member.id), userId];

            // Send the inputs for this group and date
            const resp = await AthleteWorkoutService.inputTimes(
                athletes,
                date,
                pendingInputs
            );

            // On success, reset only this group's inputs and refresh parent via onSubmit
            if (resp.ok) {
                setPendingInputs([]);
                const returnedInputs = await resp.json();
                console.log("RETURNED INPUT: ", returnedInputs);
                setSubmittedInputs(prev => [...prev, ...returnedInputs]);
            }
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
                setPendingInputs={setPendingInputs} 
                submittedInputs={submittedInputs} 
                setSubmittedInputs={setSubmittedInputs}
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
                    <View className="flex flex-row items-center w-[50%]">
                        <TrackMeButton 
                            text="Run" 
                            onPress={()=> setRunInput(true)} 
                            className="w-[50%]"
                            gray={!runInput}
                        />
                        <TrackMeButton 
                            text="Rest" 
                            onPress={()=> setRunInput(false)} 
                            className="w-[50%]"
                            gray={runInput}
                        />
                    </View>
                    <TrackMeButton 
                        text="Submit" 
                        onPress={handleInputSubmission} 
                    />
                </View>
                <QuickInput 
                    handleInputAddition={handleInputAddition} 
                    onFocus={() => scrollRef.current?.scrollToEnd({animated: true})}
                    runInput={runInput}
                    className="py-4 mx-2"
                />
            </View>
        </KeyboardAvoidingView>
    );
}

export default Inputs;