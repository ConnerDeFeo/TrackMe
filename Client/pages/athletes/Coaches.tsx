import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import AthleteService from "../../services/AthleteService";
import UserService from "../../services/UserService";

//Shows current coaches and current coach requests to athletes
const Coaches = ()=>{
    const [userId, setUserId] = useState<string>('');
    const [coaches, setCoaches] = useState<string[]>([]);
    const [requests, setRequests] = useState<string[]>([]);

    //Fetches all current coaches for a given user
    const fetchCoaches = async () => {
        const requestsResponse = await AthleteService.getCoaches(userId);
        if (requestsResponse.ok) {
            const data = await requestsResponse.json();
            setCoaches(data);
        }
    }

    //fethes all coaches for a given user
    const fetchCoachRequests = async () => {
        const requestsResponse = await AthleteService.getCoachRequests(userId);
        if (requestsResponse.ok) {
            const data = await requestsResponse.json();
            setRequests(data);
        }
        else if(requestsResponse.status === 404){
            setRequests([]);
        }
    }

    const reloadData = () => {
        fetchCoaches();
        fetchCoachRequests();
    }

    //Fetch all requests on load
    useEffect(() => {
        const fetchData = async () => {
            const userId = await UserService.getUserId();
            if(userId){
                setUserId(userId);
            }    
            reloadData();
        }
        fetchData();
    }, [userId]); //userId needed in case of page switching back and forth

    //When user hits the accept button for a coach
    async function handleCoachAcceptance(coachId: string){
        const userId = await UserService.getUserId();
        const response = await AthleteService.acceptCoachInvite(userId!,coachId);
        if(response.ok)
            reloadData();
    }

    return (
        <View className="flex-1 px-6 py-8 mt-[4rem]">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-8">Coaches</Text>
            
            <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
            {coaches.length > 0 ? (
                coaches.map(coach => (
                <View key={coach} className="py-3 border-b border-gray-100 last:border-b-0">
                    <Text className="text-lg text-gray-700 text-center">{coach[1]}</Text>
                </View>
                ))
            ) : (
                <Text className="text-gray-500 text-center py-4">No coaches yet</Text>
            )}
            </View>

            <Text className="text-2xl font-bold text-center text-gray-800 mb-6">Coach Requests</Text>
            
            <View className="space-y-4">
            {requests.length > 0 ? (
                requests.map(request => (
                <View key={request} className="bg-white rounded-lg shadow-sm p-4 mx-auto w-full max-w-sm">
                    <Text className="text-lg font-medium text-gray-800 text-center mb-4">{request[1]}</Text>
                    <View className="flex-row space-x-3">
                    <View className="flex-1">
                        <Button 
                        title="Accept" 
                        onPress={() => handleCoachAcceptance(request[0])}
                        color="#10B981"
                        />
                    </View>
                    <View className="flex-1">
                        <Button 
                        title="Decline" 
                        onPress={() => console.log("Declined")}
                        color="#EF4444"
                        />
                    </View>
                    </View>
                </View>
                ))
            ) : (
                <View className="bg-white rounded-lg shadow-sm p-6">
                <Text className="text-gray-500 text-center">No pending requests</Text>
                </View>
            )}
            </View>
        </View>
    )
}

export default Coaches;