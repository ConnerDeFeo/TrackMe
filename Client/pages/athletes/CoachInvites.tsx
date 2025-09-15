import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { useRoute } from "@react-navigation/native";
import AthleteService from "../../services/AthleteService";
import RequestsInvites from "../../components/RequestsInvites";

const CoachInvites = () =>{
    // State to store the list of athlete requests
    const [invites, setInvites] = useState<string[]>([]);
    const route = useRoute();
    // Get the fetchAthletes function passed from parent component to refresh athlete list
    const { fetchAthletes } = route.params as { fetchAthletes: () => void };

    // Fetches all athlete requests for the current user
    const fetchCoachInvites = async () => {
        const userId = await UserService.getUserId();
        const requestsResponse = await AthleteService.getCoachInvites(userId!);
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

    const handleDeclineCoachInvite = async (athleteId: string) => {
        const resp = await AthleteService.declineCoachInvite(athleteId);
        if(resp.ok){
            fetchCoachInvites();
        }
    }
    
    return(
        <RequestsInvites title={"Coach Invites"} proposals={invites} handleAcceptance={handleCoachAcceptance} handleDecline={handleDeclineCoachInvite} />
    );
}

export default CoachInvites;