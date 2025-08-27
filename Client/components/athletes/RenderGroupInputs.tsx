import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import { useNavigation } from "@react-navigation/native";

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
        currentInputs:Record<string, { time?: string | undefined; distance?: string | undefined}[]>,
        handleTimeChange: (groupId:string, idx:number, text:string)=>void,
        handleDistanceChange: (groupId:string, idx:number, text:string)=>void,
        setCurrentInputs: React.Dispatch<React.SetStateAction<Record<string, { time?: string | undefined; distance?: string | undefined}[]>>>,
        submitedInputs: Record<string, Record<string, { time?: string | undefined; distance?: string | undefined}[]>>,
        onSubmit: () => void,
        workoutGroup: string[] | undefined
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
            workoutGroup
        })=>{

    const navigation = useNavigation<any>();
    const handleInputSubmission = async () => {
        const date = new Date().toISOString().split("T")[0];
        const resp = await AthleteWorkoutService.inputTimes(groupId, date, currentInputs[groupId]);
        //If response ok, reset current inputs
        if(resp.ok){
            setCurrentInputs(prev => ({
                ...prev,
                [groupId]: []
            }));
            onSubmit();
        }
    }
    return(
        // Main container for the group with styling for card appearance
        <View key={groupId} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4 gap-y-4">
            {/* Group header with title and create group button */}
            <View className="flex flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-700">{groupName}</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('CreateWorkoutGroup', {groupId: groupId})}>
                    <Text className="text-[#E63946] underline">Create Group</Text>
                </TouchableOpacity>
            </View>

            {/**Current workout group and their inputs */}
            {workoutGroup && (
                <View className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <Text className="text-base font-medium text-gray-800 mb-2">Current Group:</Text>
                    <View className="flex flex-row flex-wrap gap-2">
                        {workoutGroup.map((member, idx) => (
                            <Text key={idx} className="text-white text-sm font-medium bg-[#E63946] rounded-full px-3 py-1">{member}</Text>
                        ))}
                    </View>
                </View>
            )}
            {/**Submitted inputs that will be displayed */}
            <View>
                <Text className="my-2">Submitted Inputs:</Text>
                {submitedInputs['individuals'] && submitedInputs['individuals'][groupId] && 
                submitedInputs['individuals'][groupId].map((input, idx) => (
                    <View key={idx} className="flex flex-row justify-between items-center mb-2 ml-2">
                        <Text className="text-gray-600">Time: {input.time}</Text>
                        <Text className="text-gray-600">Distance: {input.distance}m</Text>
                    </View>
                ))}
            </View>
            
            {/* Render all existing input pairs for this group */}
            {currentInputs[groupId]?.map((input, idx) => (
                <View key={idx} className="flex flex-row justify-between items-center mb-2">
                    {/* Time input field */}
                    <TextInput
                        placeholder="Enter time"
                        keyboardType="numeric"
                        value={input?.time}
                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                        onChangeText={text => handleTimeChange(groupId, idx, text)}
                    />
                    {/* Distance input field */}
                    <TextInput
                        placeholder="Enter distance"
                        keyboardType="numeric"
                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                        value={input?.distance}
                        onChangeText={text => handleDistanceChange(groupId, idx, text)}
                    />
                    {/* Units label */}
                    <Text>Meters</Text>
                </View>
            ))}
            <View className="flex flex-row items-center justify-between">
                {/* Button to remove last input */}
                <TouchableOpacity 
                    className="bg-[#E63946] rounded-lg p-2 w-[45%]"
                    onPress={() => {
                    setCurrentInputs(prev => {
                        const updatedGroup = prev[groupId]?.slice(0, -1) || [];
                        return { ...prev, [groupId]: updatedGroup };
                    });
                }}>
                    <Text className="text-white text-center">Remove</Text>
                </TouchableOpacity>

                {/* Button to add new input pair to the group */}
                <TouchableOpacity 
                    className="bg-[#E63946] rounded-lg p-2 w-[45%]"
                    onPress={() => {
                        // Initialize or update the inputs array for this group
                        let updatedInputs: { time?: string; distance?: string }[] = [];
                        
                        // Check if group has existing inputs, if not create first input
                        if (currentInputs[groupId] === undefined) {
                            updatedInputs = [{ time: '', distance: '' }];
                        } else {
                            // Add new empty input to existing inputs
                            updatedInputs = [...currentInputs[groupId], { time: '', distance: '' }];
                        }
                        
                        // Update state with new inputs array for this group
                        setCurrentInputs(prev => ({ ...prev, [groupId]: updatedInputs }));
                    }
                }>
                    <Text className="text-white text-center">Add</Text>
                </TouchableOpacity>
            </View>

            {/* Submit the current inputs for the current group */}
            <Button title="Submit" color="black" onPress={handleInputSubmission} />
        </View>
    );
}
export default RenderGroupInputs;