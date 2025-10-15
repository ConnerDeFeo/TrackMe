import { useCallback, useState } from "react";
import usePersistentState from "../../common/hooks/usePersistentState";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Input } from "../../common/types/inputs/Input";
import InputTracking from "../../common/components/InputTracking";
import TrackMeButton from "../../common/components/display/TrackMeButton";
import DateService from "../../services/DateService";
import UserService from "../../services/UserService";
import { useWorkoutGroup } from "../../common/hooks/useWorkoutGroup";
import InputDisplay from "../../common/components/display/input/InputDisplay";
import { Pressable, ScrollView, Text, View } from "react-native";
import TextButton from "../../common/components/display/TextButton";
import { InputType } from "../../common/constants/Enums";
import QuickInput from "../../common/components/QuickInput";

//Page where athletes input times
const Inputs = ()=>{
    // Track current input values for each given group { groupId : [time/distance, time/distance] }
    const [currentInputs, setCurrentInputs] = usePersistentState<Input[]>('current', []);
    const { workoutGroup } = useWorkoutGroup();
    // Store previously submitted workout inputs organized by date and group
    const [submittedInputs, setSubmittedInputs] = useState<Input[]>([]);
    const [selectedSubmittedInputs, setSelectedSubmittedInputs] = useState<{inputId:number, type: InputType}[]>([]);
    const [clipBoard, setClipBoard] = useState<boolean>(false);

    const navigation = useNavigation<any>();

    // Fetch previously submitted workout inputs from the server
    const fetchSubmittedInputs = useCallback(async () => {
        const resp = await AthleteWorkoutService.viewWorkoutInputs();
        if (resp.ok) {
            const inputs = await resp.json();
            setSubmittedInputs(inputs);
        }
        else{
            setSubmittedInputs([]);
        }
    }, []);

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
                currentInputs
            );

            // On success, reset current inputs and refresh submitted inputs
            if (resp.ok) {
                setSubmittedInputs(prev => [...prev, ...currentInputs]);
                setCurrentInputs([]);
            }
        }
    };

    // Fetch submitted inputs on component mount
    useFocusEffect(
        useCallback(() => {
            fetchSubmittedInputs();
        }, [fetchSubmittedInputs])
    );

    /**
     * Removes the selected previous entries by their input IDs.
     * Clears the selection on success and triggers onSubmit.
     */
    const handleInputRemoval = async () => {
        const resp = await AthleteWorkoutService.removeInputs(selectedSubmittedInputs);

        if (resp.ok) {
            // Reset selection and refresh parent
            setSelectedSubmittedInputs([]);
            fetchSubmittedInputs();
        }
    };

    // Handle time input changes with validation (numbers only)
    const handleTimeChange = ( idx: number, value: string)=>{
        // Only allow numeric values or empty string
        if(isNaN(Number(value)) && value !== ''){
            return;
        }
        const updatedValue = value === "" ? 0 : Number(value);
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs((prev: Input[]) => {
            const updatedGroup = prev.map((input, i) => i === idx ? { ...input, time: updatedValue } : input) || [];
            return updatedGroup;
        });
    }

    // Handle distance input changes with validation (integers only)
    const handleDistanceChange = (idx: number, value: string)=>{
      // Only allow integer values or empty string
      if (/^\d*$/.test(value)) {
        const updatedValue = value === "" ? 0 : Number(value);
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs((prev: Input[]) => {
          const updatedGroup = prev?.map((input, i) => i === idx ? { ...input, distance: updatedValue } : input) || [];
          return updatedGroup;
        });
      }
    }

    const handleRestChange = (idx: number, value: string)=>{
      // Only allow integer values or empty string
      if (/^\d*$/.test(value)) {
        const updatedValue = value === "" ? 0 : Number(value);
        // Update the specific input in the group while preserving other inputs
        setCurrentInputs((prev: Input[]) => {
          const updatedGroup = prev?.map((input, i) => i === idx ? { ...input, restTime: updatedValue } : input) || [];
          return updatedGroup;
        });
      }
    }

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

    return (
        <View className="flex-1">
            {/* Submitted Entries Section - Scrollable */}
            <ScrollView className="flex-1 px-6 pt-4 bg-white">
                <View className="flex flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-gray-800">
                        Submitted Entries
                    </Text>
                    {selectedSubmittedInputs.length > 0 && <TextButton text={`Remove(${selectedSubmittedInputs.length})`} onPress={handleInputRemoval} red/>}
                </View>
                <View className="gap-y-1 mb-8">
                    {submittedInputs.length > 0 ? (
                        submittedInputs.map((input, idx) => (
                            <Pressable key={idx} onPress={() => handleSubmittedInputSelection(input.type, input.inputId)} >
                                <InputDisplay input={input} selected={selectedSubmittedInputs.some(selected => selected.inputId === input.inputId && selected.type === input.type)} />
                            </Pressable>
                        ))
                        ) : (
                        <Text className="text-gray-500 text-center py-4">
                            No entries submitted yet
                        </Text>
                    )}
                </View>
            </ScrollView>

            {/* Input Tracking Section - Sticky at Bottom with max height */}
            <View className="bg-white border-t border-gray-200" style={{ maxHeight: '50%' }}>
                <ScrollView className="px-6 py-4">
                    <View className="flex flex-row justify-between items-center">
                        <Text className="text-2xl font-bold text-gray-800 mb-4">
                            New Entry
                        </Text>
                        <TrackMeButton
                            text={clipBoard ? "Quick Input" : "Clipboard"}
                            onPress={() => setClipBoard(prev => !prev)}
                            className="w-[40%]"
                        />
                    </View>
                    <View className="flex flex-row justify-between items-center mb-4">
                        <Pressable onPress={() => navigation.navigate('CreateWorkoutGroup')} className="bg-blue-50 rounded-full inline p-2">
                            <Text className="trackme-blue text-sm">Workout Group</Text>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('MassInput')} className="bg-blue-50 rounded-full inline p-2">
                            <Text className="trackme-blue text-sm">Mass Input</Text>
                        </Pressable>
                    </View>
                    {/* Display current workout partners if any */}
                    {workoutGroup.length > 0 && (
                        <View className="bg-gray-100 p-4 rounded-lg mb-4">
                            <Text className="text-sm font-medium text-gray-600 mb-2">
                                Workout Partners
                            </Text>
                            <View className="flex flex-row flex-wrap gap-2">
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
                        </View>
                    )}
                    { clipBoard ? 
                        <>
                            <InputTracking
                                currentInputs={currentInputs ?? []}
                                setCurrentInputs={setCurrentInputs}
                                handleTimeChange={handleTimeChange}
                                handleDistanceChange={handleDistanceChange}
                                handleRestChange={handleRestChange}
                            />
                            {/* Submit Button */}
                            <TrackMeButton
                                onPress={handleInputSubmission}
                                text="Submit Entries"
                            />
                        </>
                        :
                        <QuickInput setSubmittedInputs={(input: Input) => setSubmittedInputs(prev => [...prev, input])}/>
                    }
                </ScrollView>
            </View>
        </View>
    );
}

export default Inputs;