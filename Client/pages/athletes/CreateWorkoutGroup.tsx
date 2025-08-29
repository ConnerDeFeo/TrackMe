import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import GeneralService from "../../services/GeneralService";
import UserService from "../../services/UserService";
import usePersistentState from "../../hooks/usePersistentState";
import { useWorkoutGroup } from "../../hooks/useWorkoutGroup";

//Create workout group for a given group
/**
 * CreateWorkoutGroup Component
 * 
 * A React Native component that allows users to create a workout group by selecting athletes
 * from an existing group and providing a workout group name.
 * 
 * @component
 * 
 * @description
 * This component provides functionality to:
 * - Fetch athletes from a specific group
 * - Allow selection/deselection of athletes for the workout group
 * - Create a new workout group with selected athletes
 * - Navigate back after successful creation
 * 
 * @navigation
 * Expects a `groupId` parameter from the route to identify which group's athletes to fetch
 * 
 * @state
 * - `workoutGroupName`: The name for the new workout group
 * - `groupMembers`: Array of athletes available in the source group
 * - `selectedAthletes`: Array of athlete IDs selected for the workout group
 * 
 * @apiCalls
 * - `GeneralService.getAthletesForGroup()`: Fetches athletes belonging to the specified group
 * - `UserService.getUserId()`: Gets current user ID to auto-select them
 * - `AthleteWorkoutService.createWorkoutGroup()`: Creates the workout group with selected athletes
 * 
 * @behavior
 * - Automatically includes the current user in the selected athletes list
 * - Uses current date (YYYY-MM-DD format) for workout group creation
 * - Navigates back to previous screen on successful group creation
 * 
 * @returns {JSX.Element} A form interface for creating workout groups with athlete selection
 */
const CreateWorkoutGroup = ()=>{
    // Navigation and routing setup
    const navigation = useNavigation<any>();
    const route = useRoute();
    const {groupId} = route.params as { groupId: string };
    const [groupMembers, setGroupMembers] = useState<string[]>([]); // All available athletes from the source group
    // Selected athletes for the workout group
    const {workoutGroup, addAthlete, removeAthlete} = useWorkoutGroup(groupId);

    // Fetch group athletes on component mount
    useEffect(()=>{
        /**
         * Fetches all athletes belonging to the specified group and auto-selects current user
         * Sets up initial state with group members and pre-selects the current user
         */
        const fetchGroupAthletes = async ()=>{
            const resp = await GeneralService.getAthletesForGroup(groupId);
            const userId = await UserService.getUserId();
            if (resp.ok && userId) {
                const data = await resp.json();
                setGroupMembers(data); // Populate available athletes
            }
        }
        fetchGroupAthletes();
    },[]);

    const handleWorkoutGroupChange =(athlete: {id: string, username: string}) => {
        
        if (workoutGroup.some(member => member.id === athlete.id)) {
            removeAthlete(athlete.id);
        } else {
            addAthlete(athlete);
        }
    }

    return (
        <View className="mt-16 px-6 bg-white min-h-screen">
            {/* Header Section */}
            <Text className="text-3xl font-bold text-black mb-8 text-center">Create Workout Group</Text>
            
            {/* Athletes Selection Section */}
            <Text className="text-xl font-semibold text-black mb-4">Select Athletes</Text>
            
            {/* Athletes List with Selection Toggle */}
            <View className="mb-8">
                {groupMembers.map((athlete) => {
                    const isSelected = workoutGroup.some(member => member.id === athlete[0]);
                    return (
                        <View key={athlete[0]} className="flex flex-row justify-between items-center bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
                            {/* Athlete name display */}
                            <Text className="text-lg text-black font-medium">{athlete[1]}</Text>
                            {/* Selection toggle button */}
                            <TouchableOpacity 
                                onPress={() => handleWorkoutGroupChange({id: athlete[0], username: athlete[1]})}
                                className={`px-6 py-2 rounded-lg ${isSelected ? 'bg-gray-200' : 'bg-red-500'}`}
                                style={{backgroundColor: isSelected ? '#f3f4f6' : '#E63946'}}
                            >
                            <Text className={`font-semibold ${isSelected ? 'text-black' : 'text-white'}`}>
                                {isSelected ? "Deselect" : "Select"}
                            </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
            
            {/* Create Group Action Button */}
            <TouchableOpacity 
                onPress={()=>navigation.goBack()}
                className="p-4 rounded-xl shadow-lg"
                style={{backgroundColor: '#E63946'}}
            >
                <Text className="text-white text-xl font-bold text-center">Finish</Text>
            </TouchableOpacity>
        </View>
    )
};
export default CreateWorkoutGroup;