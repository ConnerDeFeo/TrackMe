import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import AthleteService from "../../services/AthleteService";
import { getCurrentUser } from "aws-amplify/auth";

//Shows current coaches and current coach requests to athletes
const Coaches = ()=>{
    const [coaches, setCoaches] = useState<string[]>([]);
    const [requests, setRequests] = useState<string[]>([]);

    useEffect(()=>{
        // Fetch coaches and requests data
        const fetchCoaches = async () => {
            try {
                const user = await getCurrentUser();
                const userId = user.userId;
                const coachesResponse = await AthleteService.getCoaches(userId);
                const requestsResponse = await AthleteService.getCoachRequests(userId);
                
                if(coachesResponse.ok){
                    const data = await coachesResponse.json();
                    setCoaches(data);
                }
                if(requestsResponse.ok){
                    const data = await requestsResponse.json();
                    setRequests(data);
                }
            } catch (error) {
                console.error('Error fetching coaches:', error);
            }
        }

        fetchCoaches();
    },[])
    return (
        <View>
            <Text className="text-lg font-bold">Coaches</Text>
            {coaches.map(coach => (
                <Text key={coach}>{coach}</Text>
            ))}
            <Text className="text-lg font-bold">Coach Requests</Text>
            {requests.map(request => (
                <Text key={request}>{request}</Text>
            ))}
        </View>
    )
}

export default Coaches;