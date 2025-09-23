import React, { useEffect, useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import { useNavigation } from "@react-navigation/native";
import UserService from "../../services/UserService";
import usePersistentState from "../../hooks/usePersistentState";
import AsyncStorage from "../../services/AsyncStorage";
import { useWorkoutGroup } from "../../hooks/useWorkoutGroup";
import { useNav } from "../../hooks/useNav";
import InputTracking from "../InputTracking";
import TimeDistanceDisplay from "../TimeDistanceDisplay";

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

    const {navigate} = useNav();
    //Current workout group members
    const { workoutGroup } = useWorkoutGroup(groupId);

    const handleInputSubmission = async () => {
        const date = new Date().toISOString().split("T")[0];
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

    return(
        // Main container for the group with styling for card appearance
        <View key={groupId} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 gap-y-4 mt-4">
            {/* Group header with title and create group button */}
            <View className="flex flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-700">{groupName}</Text>
                <TouchableOpacity onPress={()=>navigate('CreateWorkoutGroup', { groupId })}>
                    <Text className="text-[#E63946]">{workoutGroup.length>0 ? "Update Workout Group" : "Create Workout Group"}</Text>
                </TouchableOpacity>
            </View>
            {/* Go to mass inputs */}
            <TouchableOpacity onPress={()=>navigate('MassInput', { groupId, groupName})}>
                <Text className="text-[#E63946] ml-auto">Mass Input</Text>
            </TouchableOpacity>

            {/**Current workout group and their inputs */}
            {workoutGroup.length > 0 && (
                <View className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <Text className="text-base font-medium text-gray-800 mb-2">Current Workout Group:</Text>
                    <View className="flex flex-row flex-wrap gap-2">
                        {workoutGroup.map((member, idx) => (
                            <Text key={idx} className="text-white text-sm font-medium bg-[#E63946] rounded-full px-3 py-1">{member.username}</Text>
                        ))}
                    </View>
                </View>
            )}
            {/**Submitted inputs that will be displayed */}
            {submitedInputs[groupId] &&
                <View>
                    <Text className="my-2">Submitted:</Text>
                    {submitedInputs[groupId].map((input, idx) => (
                        <TimeDistanceDisplay key={idx} time={input.time} distance={input.distance} />
                    ))}
                </View>
            }
            {/* Render all existing input pairs for this group */}
            <InputTracking
                currentInputs={currentInputs}
                setCurrentInputs={setCurrentInputs}
                identifierId={groupId}
                handleTimeChange={handleTimeChange}
                handleDistanceChange={handleDistanceChange}
            />

            {/* Submit the current inputs for the current group */}
            <TouchableOpacity className="bg-black rounded-lg p-3" onPress={handleInputSubmission}>
                <Text className="text-white text-center font-medium">Submit</Text>
            </TouchableOpacity>
        </View>
    );
}
export default RenderGroupInputs;