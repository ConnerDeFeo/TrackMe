import React, { useState } from "react";
import { Text, Pressable, View } from "react-native";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import UserService from "../../services/UserService";
import { useWorkoutGroup } from "../../common/hooks/useWorkoutGroup";
import InputTracking from "../InputTracking";
import { useNavigation } from "@react-navigation/native";
import DateService from "../../services/DateService";
import { Input } from "../../common/types/inputs/Input";
import InputDisplay from "../display/InputDisplay";

//Component used to render input fields for a specific group
/**
 * Renders input fields for a specific group, allowing users to enter time and distance values.
 * 
 * @param groupId - The unique identifier for the group
 * @param currentInputs - Record containing arrays of input objects with optional time and distance values for each group
 * @param handleTimeChange - Callback function to handle time input changes, receives groupId, input index, and new text value
 * @param handleDistanceChange - Callback function to handle distance input changes, receives groupId, input index, and new text value
 * @param setCurrentInputs - State setter function to update the currentInputs record
 * 
 * @returns A React component that displays a group card with:
 * - Group header with title and "Create Group" link
 * - Dynamic list of time/distance input pairs
 * - "Add input" button to append new input pairs to the group
 */
const RenderGroupInputs: React.FC<
    {
        groupId: string,
        groupName: string,
        currentInputs: Record<string, Input[]>,
        handleTimeChange: (groupId: string, idx: number, text: string) => void,
        handleDistanceChange: (groupId: string, idx: number, text: string) => void,
        handleRestChange: (groupId: string, idx: number, text: string) => void,
        setCurrentInputs: React.Dispatch<React.SetStateAction<Record<string, Input[]>>>,
        submitedInputs: Record<string, Input[]>,
        onSubmit: () => void
    }
> = ({
    groupId,
    groupName,
    currentInputs,
    handleTimeChange,
    handleDistanceChange,
    handleRestChange,
    setCurrentInputs,
    submitedInputs,
    onSubmit,
}) => {
    // Retrieve the workout group members for this group ID
    const { workoutGroup } = useWorkoutGroup(groupId);

    // Track which previous entries (by inputId) are selected for removal
    const [selectedSubmitedInputs, setSelectedSubmitedInputs] = useState<number[]>([]);

    // Navigation object to move between screens
    const navigation = useNavigation<any>();

    /**
     * Submits the current input entries for all athletes in the group,
     * including the current user, for today's date.
     * On success, clears the inputs for this group and invokes onSubmit callback.
     */
    const handleInputSubmission = async () => {
        const date = DateService.formatDate(new Date());
        const userId = await UserService.getUserId();

        if (userId) {
            // Combine group members and current user into one list of athlete IDs
            const athletes = [...workoutGroup.map(member => member.id), userId];

            // Send the inputs for this group and date
            const resp = await AthleteWorkoutService.inputTimes(
                athletes,
                groupId,
                date,
                currentInputs[groupId]
            );

            // On success, reset only this group's inputs and refresh parent via onSubmit
            if (resp.ok) {
                setCurrentInputs(prev => ({
                    ...prev,
                    [groupId]: []
                }));
                onSubmit();
            }
        }
    };

    /**
     * Removes the selected previous entries by their input IDs.
     * Clears the selection on success and triggers onSubmit.
     */
    const handleInputRemoval = async () => {
        const resp = await AthleteWorkoutService.removeInputs(selectedSubmitedInputs);

        if (resp.ok) {
            // Reset selection and refresh parent
            setSelectedSubmitedInputs([]);
            onSubmit();
        }
    };

    return (
        <View
            key={groupId}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
            {/* Header section with group name and navigation buttons */}
            <View className="px-5 pt-4 pb-1 bg-gray-50 border-b border-gray-100">
                <View className="flex flex-row justify-between items-start mb-3">
                    <Text className="text-lg font-bold text-gray-900 max-w-[50%]">
                        {groupName}
                    </Text>
                    <View className="flex flex-row gap-3">
                        {/* Navigate to Mass Input screen */}
                        <Pressable onPress={() => navigation.navigate('MassInput', { groupId, groupName })}>
                            <Text className="text-sm font-medium trackme-blue bg-blue-50 px-4 py-2 rounded-full">
                                Mass Input
                            </Text>
                        </Pressable>

                        {/* Create or Update group button */}
                        <Pressable onPress={() => navigation.navigate('CreateWorkoutGroup', { groupId })}>
                            <Text className="text-sm font-medium trackme-blue bg-blue-50 px-4 py-2 rounded-full">
                                {workoutGroup.length > 0 ? "Update Group" : "Create Group"}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Display current workout partners if any */}
                {workoutGroup.length > 0 && (
                    <View>
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
            </View>

            {/* Content section containing previous entries, new inputs, and submit */}
            <View className="p-5 gap-y-3">
                {/* Section: Previous Entries */}
                {submitedInputs[groupId] && (
                    <View>
                        <View className="flex flex-row items-center justify-between mb-3">
                            <Text className="text-base font-semibold text-gray-800">
                                Previous Entries
                            </Text>
                            {/* Show removal button only when items are selected */}
                            {selectedSubmitedInputs.length > 0 && (
                                <Pressable
                                    onPress={handleInputRemoval}
                                    className="pl-4 py-2"
                                >
                                    <Text className="text-sm font-medium trackme-red">
                                        Remove ({selectedSubmitedInputs.length})
                                    </Text>
                                </Pressable>
                            )}
                        </View>

                        {/* List out each previous entry with selectable UI */}
                        <View className="gap-y-2">
                            {submitedInputs[groupId].map((input, idx) => {
                                if(!input.inputId){
                                    return <Text className="trackme-red">Something went wrong!</Text>
                                }
                                return (
                                    <Pressable
                                        key={idx}
                                        onPress={() => {
                                            if(!input.inputId) return;
                                            const alreadySelected = selectedSubmitedInputs.includes(input.inputId);
                                            // Toggle selection state
                                            setSelectedSubmitedInputs(prev =>
                                                alreadySelected
                                                    ? prev.filter(id => id !== input.inputId) as number[]
                                                    : [...prev, input.inputId] as number[]
                                            );
                                        }}
                                    >
                                        <InputDisplay input={input} selected={selectedSubmitedInputs.includes(input.inputId)} />
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Section: New Inputs */}
                <InputTracking
                    currentInputs={currentInputs}
                    setCurrentInputs={setCurrentInputs}
                    identifierId={groupId}
                    handleTimeChange={handleTimeChange}
                    handleDistanceChange={handleDistanceChange}
                    handleRestChange={handleRestChange}
                />

                {/* Submit button to save new inputs */}
                <Pressable
                    className="trackme-bg-blue rounded-xl py-3 shadow-sm"
                    onPress={handleInputSubmission}
                >
                    <Text className="text-white text-center font-semibold text-base">
                        Submit Entry
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default RenderGroupInputs;