import { useEffect, useState } from "react";
import AthleteService from "../../services/AthleteService";
import RequestsInvites from "../../components/RequestsInvites";

const CoachInvites = () =>{
    // State to store the list of athlete requests
    const [invites, setInvites] = useState<string[]>([]);
    // Fetches all athlete requests for the current user
    const fetchCoachInvites = async () => {
        const requestsResponse = await AthleteService.getCoachInvites();
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
    async function handleCoachAcceptance(coachId: string){
        const response = await AthleteService.acceptCoachInvite(coachId);
        // If acceptance is successful, refresh the athlete list in parent component
        if(response.ok){
            fetchCoachInvites();
        }
    }

    const handleDeclineCoachInvite = async (athleteId: string) => {
        const resp = await AthleteService.declineCoachInvite(athleteId);
        if(resp.ok){
            fetchCoachInvites();
        }
    }
    
    return(
        <RequestsInvites proposals={invites} handleAcceptance={handleCoachAcceptance} handleDecline={handleDeclineCoachInvite} />
    );
}

export default CoachInvites;