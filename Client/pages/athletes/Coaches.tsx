import { useEffect, useState } from "react";
import { Text } from "react-native";
import AthleteService from "../../services/AthleteService";
import { getCurrentUser } from "aws-amplify/auth";

//Shows current coaches and current coach requests to athletes
const Coaches = ()=>{
    const [coaches, setCoaches] = useState([]);
    const [requests, setRequests] = useState([]);

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
                    setCoaches(data.coaches);
                }
                if(requestsResponse.ok){
                    const data = await requestsResponse.json();
                    setRequests(data.requests);
                }
            } catch (error) {
                console.error('Error fetching coaches:', error);
            }
        }

        fetchCoaches();
    },[])
    return (
        <Text>Coaches</Text>
    )
}

export default Coaches;