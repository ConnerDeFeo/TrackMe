import { useEffect, useState } from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import CoachService from "../../services/CoachService";
import UserService from "../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";
import AthleteService from "../../services/AthleteService";

const CoachRequests = () =>{
    // State to store the list of athlete requests
    const [invites, setInvites] = useState<string[]>([]);
    const route = useRoute();
    // Get the fetchAthletes function passed from parent component to refresh athlete list
    const { fetchAthletes } = route.params as { fetchAthletes: () => void };

    // Fetches all athlete requests for the current user
    const fetchCoachInvites = async () => {
        const userId = await UserService.getUserId();
        const requestsResponse = await AthleteService.getCoachRequests(userId!);
        if (requestsResponse.ok) {
            const data = await requestsResponse.json();
            setInvites(data);
        }
        // Handle case where user has no pending requests
        else if(requestsResponse.status === 404){
            setInvites([]);
        }
    }
    // Fetch all athlete requests when component mounts
    useEffect(() => {
        fetchCoachInvites();
    }, []); // Empty dependency array - only run on mount

    // Handle accepting a coach invitation
    async function handleCoachAcceptance(athleteId: string){
        const userId = await UserService.getUserId();
        const response = await AthleteService.acceptCoachInvite(userId!,athleteId);
        // If acceptance is successful, refresh the athlete list in parent component
        if(response.ok){
            fetchCoachInvites();
            fetchAthletes();
        }
    }
    
    return(
        <View className="mt-[4rem]">
            {/* Header with back button and title */}
            <Text className="text-4xl font-bold p-4">Coach Requests</Text>
            
            {/* Requests list or empty state */}
            <View className="gap-y-4">
                {invites.length > 0 ? (
                    // Render each athlete request with accept/decline buttons
                    invites.map(invite => (
                    <View key={invite} className="bg-white rounded-lg p-4 mx-auto w-[90%] border border-gray-300">
                        <View className="flex-row items-center justify-between">
                            {/* Display athlete name */}
                            <Text className="text-xl font-medium flex-1">{invite[1]}</Text>
                            <View className="flex-row gap-x-2">
                                <TouchableOpacity 
                                    className="bg-black rounded-lg py-2 px-3"
                                    onPress={() => handleCoachAcceptance(invite[0])}
                                >
                                    <Text className="text-white font-semibold text-center">Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className="bg-red-500 rounded-lg py-2 px-3"
                                    onPress={() => console.log("Declined")}
                                >
                                    <Text className="text-white font-semibold text-center">Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    ))
                ) : (
                    // Show message when no pending requests exist
                    <View className="bg-white rounded-lg shadow-sm p-6">
                    <Text className="text-gray-500 text-center">No pending requests</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default CoachRequests;