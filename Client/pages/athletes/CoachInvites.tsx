import { useEffect, useState } from "react";
import RequestsInvites from "../../components/display/RequestsInvites";
import RelationService from "../../services/RelationService";

const CoachInvites = () =>{
    // State to store the list of athlete requests
    const [invites, setInvites] = useState<string[]>([]);
    // Fetches all athlete requests for the current user
    const fetchCoachInvites = async () => {
        const requestsResponse = await RelationService.getRelationInvites();
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
        const response = await RelationService.addRelation(coachId);
        // If acceptance is successful, refresh the athlete list in parent component
        if(response.ok){
            fetchCoachInvites();
        }
    }

    const handleDeclineCoachInvite = async (athleteId: string) => {
        const resp = await RelationService.removeRelation(athleteId);
        if(resp.ok){
            fetchCoachInvites();
        }
    }
    console.log("Invites: ", invites);
    return(
        <RequestsInvites proposals={invites} handleAcceptance={handleCoachAcceptance} handleDecline={handleDeclineCoachInvite} />
    );
}

export default CoachInvites;