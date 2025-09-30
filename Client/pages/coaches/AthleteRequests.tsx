import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { useRoute } from "@react-navigation/native";
import CoachService from "../../services/CoachService";
import RequestsInvites from "../../components/display/RequestsInvites";

const AthleteRequests = () =>{
    // State to store the list of coach requests
    const [requests, setRequests] = useState<string[]>([]);
    const route = useRoute();
    // Get the fetchCoaches function passed from parent component to refresh coach list
    const { fetchAthletes } = route.params as { fetchAthletes: () => void };

    // Fetches all coach requests for the current user
    const fetchAthleteRequests = async () => {
        const userId = await UserService.getUserId();
        const requestsResponse = await CoachService.getAthleteRequests();
        if (requestsResponse.ok) {
            const data = await requestsResponse.json();
            setRequests(data);
        }
        // Handle case where user has no pending requests
        else if(requestsResponse.status === 404){
            setRequests([]);
        }
    }

    // Fetch all coach requests when component mounts
    useEffect(() => {
        fetchAthleteRequests();
    }, []); // Empty dependency array - only run on mount

    // Handle accepting a coach invitation
    async function handleAthleteAcceptance(athleteId: string){
        const userId = await UserService.getUserId();
        const response = await CoachService.acceptAthleteRequest(athleteId);
        // If acceptance is successful, refresh the coach list in parent component
        if(response.ok){
            fetchAthleteRequests();
            fetchAthletes();
        }
    }
    
    const handleDeclineAthleteRequest = async (athleteId: string) => {
        const resp = await CoachService.declineAthleteRequest(athleteId);
        if(resp.ok){
            fetchAthleteRequests();
        }
    }
    return(
        <RequestsInvites proposals={requests} handleAcceptance={handleAthleteAcceptance} handleDecline={handleDeclineAthleteRequest} />
    );
}

export default AthleteRequests;