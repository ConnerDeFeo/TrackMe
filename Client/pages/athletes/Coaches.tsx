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
    }

    const reloadData = () => {
        fetchCoaches();
        fetchCoachRequests();
    }

    //Fetch all requests on load
    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await UserService.getUserId();
            if (userId)
                setUserId(userId);
        }
        fetchUserId();
        reloadData();
    }, []);

    //When user hits the accept button for a coach
    async function handleCoachAcceptance(coachId: string){
        const userId = await UserService.getUserId();
        const response = await AthleteService.acceptCoachInvite(userId!,coachId);
        if(response.ok)
            reloadData();
    }

    return (
        <View>
            <Text className="text-lg font-bold text-center">Coaches</Text>
            {coaches.map(coach => (
                <Text key={coach} className="text-center border-b border-gray-200">{coach[1]}</Text>
            ))}
            <Text className="text-lg font-bold text-center mt-10 mb-5">Coach Requests</Text>
            {requests.map(request => (
                <View key={request} className="w-[75%] mx-auto">
                    <Text className="text-xl border-b border-gray-200">{request[1]}</Text>
                    <Button title="accept" color="green" onPress={() => handleCoachAcceptance(request[0])}/>
                    <Button title="decline" color="red" />
                </View>
            ))}
        </View>
    )
}

export default Coaches;