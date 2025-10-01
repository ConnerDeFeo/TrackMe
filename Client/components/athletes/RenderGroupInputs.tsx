import React, { useState } from "react";
import { Text, Pressable, View } from "react-native";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import UserService from "../../services/UserService";
import { useWorkoutGroup } from "../../hooks/useWorkoutGroup";
import InputTracking from "../InputTracking";
import TimeDistanceDisplay from "../display/TimeDistanceDisplay";
import { useNavigation } from "@react-navigation/native";
import DateService from "../../services/DateService";

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
        groupId:string, 
        groupName:string,
        currentInputs:Record<string, { time: string | undefined; distance: string | undefined}[]>,
        handleTimeChange: (groupId:string, idx:number, text:string)=>void,
        handleDistanceChange: (groupId:string, idx:number, text:string)=>void,
        setCurrentInputs: React.Dispatch<React.SetStateAction<Record<string, { time: string | undefined; distance: string | undefined}[]>>>,
        submitedInputs: Record<string, { time: number; distance: number, inputId: number}[]>,
        onSubmit: () => void
    }> = (
        {
            groupId, 
            groupName, 
            currentInputs, 
            handleTimeChange, 
            handleDistanceChange, 
            setCurrentInputs, 
            submitedInputs, 
            onSubmit,
        })=>{

    //Current workout group members
    const { workoutGroup } = useWorkoutGroup(groupId);
    // List of input IDs that have been submitted and selected by user
    const [selectedSubmitedInputs, setSelectedSubmitedInputs] = useState<number[]>([]);
    const navigation = useNavigation<any>();

    const handleInputSubmission = async () => {
        const date = DateService.formatDate(new Date());
        const userId = await UserService.getUserId();
        if(userId){
            //All athletes in workout group plus the logged in user
            const athletes = [...workoutGroup.map(athlete => athlete.id), userId];
            const resp = await AthleteWorkoutService.inputTimes(athletes, groupId, date, currentInputs[groupId]);
            //If response ok, reset current inputs
            if(resp.ok){
                setCurrentInputs(prev => ({
                    ...prev,
                    [groupId]: []
                }));
                onSubmit();
            }
        }
    }

    const handleInputRemoval = async () => {
        const resp = await AthleteWorkoutService.removeInputs(selectedSubmitedInputs);
        if(resp.ok){
            setSelectedSubmitedInputs([]);
            onSubmit();
        }
    }
    return(
        // Main container for the group with modern card styling
        <View key={groupId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Group header section */}
            <View className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                <View className="flex flex-row justify-between items-start mb-3">
                    <Text className="text-xl font-bold text-gray-900">{groupName}</Text>
                    <View className="flex flex-row gap-3">
                        <Pressable onPress={()=>navigation.navigate('MassInput', { groupId, groupName })}>
                            <Text className="text-sm font-medium trackme-blue bg-blue-50 px-3 py-1.5 rounded-full">Mass Input</Text>
                        </Pressable>
                        <Pressable onPress={()=>navigation.navigate('CreateWorkoutGroup', { groupId })}>
                            <Text className="text-sm font-medium trackme-blue bg-blue-50 px-3 py-1.5 rounded-full">
                                {workoutGroup.length>0 ? "Update Group" : "Create Group"}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Current workout group members */}
                {workoutGroup.length > 0 && (
                    <View>
                        <Text className="text-sm font-medium text-gray-600 mb-2">Workout Partners</Text>
                        <View className="flex flex-row flex-wrap gap-2">
                            {workoutGroup.map((member, idx) => (
                                <View key={idx} className="bg-white border border-gray-200 rounded-full px-3 py-1">
                                    <Text className="text-sm font-medium text-gray-700">{member.username}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {/* Content section */}
            <View className="px-5 py-5 gap-y-5">
                {/* Previous entries section */}
                {submitedInputs[groupId] && (
                    <View>
                        <View className="flex flex-row items-center justify-between mb-3">
                            <Text className="text-base font-semibold text-gray-800">Previous Entries</Text>
                            {selectedSubmitedInputs.length > 0 && (
                                <Pressable onPress={handleInputRemoval}>
                                    <Text className="text-sm font-medium trackme-red underline">
                                        Remove ({selectedSubmitedInputs.length})
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                        <View className="gap-y-2">
                            {submitedInputs[groupId].map((input, idx) => (
                                <Pressable key={idx} onPress={()=>{
                                    if(selectedSubmitedInputs.includes(input.inputId)){
                                        setSelectedSubmitedInputs(prev => prev.filter(id => id !== input.inputId));
                                    } else {
                                        setSelectedSubmitedInputs(prev => [...prev, input.inputId]);
                                    }
                                }}>
                                    <TimeDistanceDisplay time={input.time} distance={input.distance} selected={selectedSubmitedInputs.includes(input.inputId)} />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* New inputs section */}
                <InputTracking
                    currentInputs={currentInputs}
                    setCurrentInputs={setCurrentInputs}
                    identifierId={groupId}
                    handleTimeChange={handleTimeChange}
                    handleDistanceChange={handleDistanceChange}
                />

                {/* Submit button */}
                <Pressable 
                    className="trackme-bg-blue rounded-xl py-3 shadow-sm" 
                    onPress={handleInputSubmission}
                >
                    <Text className="text-white text-center font-semibold text-base">Submit Entry</Text>
                </Pressable>
            </View>
        </View>
    );
}
export default RenderGroupInputs;