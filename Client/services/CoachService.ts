import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachService = {
    //Creates coach
    createCoach: async () => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_coach`);
    },
    searchAthletes: async (searchTerm:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/search_athletes?searchTerm=${searchTerm}`);
    },
    inviteAthlete: async (userId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/invite_athlete`, 
            { 
                'athleteId': userId
            }
        );
    },
    getAthletes: async () => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_athletes`);
    },
    getAthleteRequests: async () => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/view_athlete_requests`);
    },
    acceptAthleteRequest: async (athleteId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/accept_athlete_request`, 
            { 
                'athleteId': athleteId
            }
        );
    },
    declineAthleteRequest: async(athleteId:string) => {
        return await API.delete(`${EXPO_PUBLIC_API_URL}/coaches/decline_athlete_request?athleteId=${athleteId}`);
    }
}

export default CoachService;