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
    const navigation = useNavigation<any>();

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
        <View className="mt-[4rem] w-[95%] mx-auto">
            {/* Header with back button and title */}
            <View className="flex-row items-center">
                <TouchableOpacity  onPress={() => navigation.goBack()}>
                    <Image source={require("../../images/Back.png")} className="w-12 h-12 mx-auto" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-800 text-center">Coach Requests</Text>
            </View>
            
            {/* Requests list or empty state */}
            <View className="space-y-4">
                {invites.length > 0 ? (
                    // Render each athlete request with accept/decline buttons
                    invites.map(invite => (
                    <View key={invite} className="bg-white rounded-lg shadow-sm p-4 mx-auto w-full max-w-sm">
                        {/* Display athlete name (assuming invite[1] is the athlete name) */}
                        <Text className="text-lg font-medium text-gray-800 text-center mb-4">{invite[1]}</Text>
                        <View className="flex-row space-x-3">
                        <View className="flex-1">
                            {/* Accept button - calls handleAthleteAcceptance with athlete ID */}
                            <Button 
                            title="Accept" 
                            onPress={() => handleCoachAcceptance(invite[0])}
                            color="#10B981"
                            />
                        </View>
                        <View className="flex-1">
                            {/* Decline button - currently only logs to console */}
                            <Button 
                            title="Decline" 
                            onPress={() => console.log("Declined")}
                            color="#E63946"
                            />
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