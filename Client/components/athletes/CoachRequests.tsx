import { useEffect, useState } from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import AthleteService from "../../services/AthleteService";
import UserService from "../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";

const CoachRequests = () =>{
    // State to store the list of coach requests
    const [requests, setRequests] = useState<string[]>([]);
    const route = useRoute();
    // Get the fetchCoaches function passed from parent component to refresh coach list
    const { fetchCoaches } = route.params as { fetchCoaches: () => void };
    const navigation = useNavigation<any>();

    // Fetch all coach requests when component mounts
    useEffect(() => {
        // Fetches all coach requests for the current user
        const fetchCoachRequests = async () => {
            const userId = await UserService.getUserId();
            const requestsResponse = await AthleteService.getCoachRequests(userId!);
            if (requestsResponse.ok) {
                const data = await requestsResponse.json();
                setRequests(data);
            }
            // Handle case where user has no pending requests
            else if(requestsResponse.status === 404){
                setRequests([]);
            }
        }
        fetchCoachRequests();
    }, []); // Empty dependency array - only run on mount

    // Handle accepting a coach invitation
    async function handleCoachAcceptance(coachId: string){
        const userId = await UserService.getUserId();
        const response = await AthleteService.acceptCoachInvite(userId!,coachId);
        // If acceptance is successful, refresh the coach list in parent component
        if(response.ok)
            fetchCoaches();
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
                {requests.length > 0 ? (
                    // Render each coach request with accept/decline buttons
                    requests.map(request => (
                    <View key={request} className="bg-white rounded-lg shadow-sm p-4 mx-auto w-full max-w-sm">
                        {/* Display coach name (assuming request[1] is the coach name) */}
                        <Text className="text-lg font-medium text-gray-800 text-center mb-4">{request[1]}</Text>
                        <View className="flex-row space-x-3">
                        <View className="flex-1">
                            {/* Accept button - calls handleCoachAcceptance with coach ID */}
                            <Button 
                            title="Accept" 
                            onPress={() => handleCoachAcceptance(request[0])}
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