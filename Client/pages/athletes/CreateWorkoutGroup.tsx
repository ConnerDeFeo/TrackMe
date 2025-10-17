import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useWorkoutGroup } from "../../common/hooks/useWorkoutGroup";
import TrackMeButton from "../../common/components/display/TrackMeButton";
import RelationService from "../../services/RelationService";
import UserDisplay from "../../common/components/display/UserDisplay";

// Page for creating a workout group by selecting athletes from a source group
const CreateWorkoutGroup = ()=>{
    // Navigation and routing setup
    const navigation = useNavigation<any>();
    // All available athletes
    const [athletes, setAthletes] = useState<{firstName:string, lastName:string, relationId:string, username:string}[]>([]); 
    // Selected athletes for the workout group
    const {workoutGroup, addAthlete, removeAthlete} = useWorkoutGroup(); 
    // Loading state for async operations
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch group athletes on component mount
    useEffect(()=>{
        /**
         * Fetches all athletes belonging to the specified group and auto-selects current user
         * Sets up initial state with group members and pre-selects the current user
         */
        const fetchGroupAthletes = async ()=>{
            setLoading(true);
            const resp = await RelationService.getMutualAthletes();
            if (resp.ok) {
                const data = await resp.json();
                setAthletes(data); // Populate available athletes
                setLoading(false);
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

    return ( loading ? <ActivityIndicator size="large" color="#007AFF" className="m-10"/> :
        <View className="mt-4 px-6 bg-white min-h-screen">
            
            {/* Athletes List with Selection Toggle */}
            <View className="mb-4">
                {athletes.length > 0 ? athletes.map((athlete) => {
                    const isSelected = workoutGroup.some(member => member.id === athlete.relationId);
                    return (
                        <View key={athlete.relationId} className="flex flex-row items-center bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
                            {/* Athlete name display */}
                            <UserDisplay username={athlete.username} firstName={athlete.firstName} lastName={athlete.lastName}/>
                            {/* Selection toggle button */}
                            <TrackMeButton
                                onPress={() => handleWorkoutGroupChange({id: athlete.relationId, username: athlete.username})}
                                text={isSelected ? "Deselect" : "Select"}
                                gray={isSelected}
                                className="w-24 ml-auto"
                            />
                        </View>
                    );})
                    : 
                    <Text className="text-gray-500 text-center py-4">You have no Friends</Text>
                }
            
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