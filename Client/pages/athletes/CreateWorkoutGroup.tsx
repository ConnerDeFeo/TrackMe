import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, Pressable, View } from "react-native";
import GeneralService from "../../services/GeneralService";
import UserService from "../../services/UserService";
import { useWorkoutGroup } from "../../common/hooks/useWorkoutGroup";
import TrackMeButton from "../../common/components/display/TrackMeButton";

// Page for creating a workout group by selecting athletes from a source group
const CreateWorkoutGroup = ()=>{
    // Navigation and routing setup
    const navigation = useNavigation<any>();
    const route = useRoute();
    const {groupId} = route.params as { groupId: string };
    const [groupMembers, setGroupMembers] = useState<string[]>([]); // All available athletes from the source group
    // Selected athletes for the workout group
    const {workoutGroup, addAthlete, removeAthlete} = useWorkoutGroup(groupId); 
    const [userId, setUserId] = useState<string>('');

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
                setUserId(userId);
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
        <View className="mt-4 px-6 bg-white min-h-screen">
            
            {/* Athletes List with Selection Toggle */}
            <View className="mb-4">
                {groupMembers.map((athlete) => {
                    if(athlete[0] === userId) {
                        return;
                    }
                    const isSelected = workoutGroup.some(member => member.id === athlete[0]);
                    return (
                        <View key={athlete[0]} className="flex flex-row justify-between items-center bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
                            {/* Athlete name display */}
                            <Text className="text-lg text-black font-medium">{athlete[1]}</Text>
                            {/* Selection toggle button */}
                            <TrackMeButton
                                onPress={() => handleWorkoutGroupChange({id: athlete[0], username: athlete[1]})}
                                text={isSelected ? "Deselect" : "Select"}
                                gray={isSelected}
                                className="px-6"
                            />
                        </View>
                    );
                })}
            </View>
            
            {/* Create Group Action Button */}
            <TrackMeButton
                onPress={() => navigation.goBack()}
                text="Finish"
            />
        </View>
    )
};
export default CreateWorkoutGroup;