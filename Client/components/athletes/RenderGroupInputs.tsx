import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";

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
        setCurrentInputs: React.Dispatch<React.SetStateAction<Record<string, { time?: string | undefined; distance?: string | undefined}[]>>>
    }> = ({groupId, groupName, currentInputs, handleTimeChange, handleDistanceChange, setCurrentInputs})=>{
    return(
        // Main container for the group with styling for card appearance
        <View key={groupId} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4">
            {/* Group header with title and create group button */}
            <View className="flex flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-700">{groupName}</Text>
                <TouchableOpacity>
                    <Text className="text-[#E63946] underline">Create Group</Text>
                </TouchableOpacity>
            </View>
            
            {/* Render all existing input pairs for this group */}
            {currentInputs[groupId]?.map((input, idx) => (
                <View key={idx} className="flex flex-row justify-between items-center mb-2">
                    {/* Time input field */}
                    <TextInput
                        placeholder="Enter time"
                        value={currentInputs[groupId][idx]?.time}
                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                        onChangeText={text => handleTimeChange(groupId, idx, text)}
                    />
                    {/* Distance input field */}
                    <TextInput
                        placeholder="Enter distance"
                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                        value={currentInputs[groupId][idx]?.distance}
                        onChangeText={text => handleDistanceChange(groupId, idx, text)}
                    />
                    {/* Units label */}
                    <Text>Meters</Text>
                </View>
            ))}
            
            {/* Button to add new input pair to the group */}
            <Button title="add input" onPress={() => {
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
            }} />
        </View>
    );
}
export default RenderGroupInputs;