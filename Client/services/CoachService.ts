import API from "./API";
import UserService from "./UserService";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachService = {
    //Creates coach
    createCoach: async (userId:string, username:string) => {
        return await API.postPublic(`${EXPO_PUBLIC_API_URL}/coaches/create_coach`,
            { 
                'userId': userId, 
                'username': username 
            }
        );
    },
    searchAthletes: async (searchTerm:string, coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/search_athletes?searchTerm=${searchTerm}&coachId=${coachId}`);
    },
    inviteAthlete: async (userId:string, coachId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/invite_athlete`, 
            { 
                'athleteId': userId,
                'coachId': coachId
            }
        );
    },
    getAthletes: async (coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_athletes?coachId=${coachId}`);
    },
    getAthleteRequests: async (userId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/view_athlete_requests?userId=${userId}`);
    },
    acceptAthleteRequest: async (coachId:string, athleteId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/accept_athlete_request`, 
            { 
                'coachId': coachId,
                'athleteId': athleteId
            }
        );
    },
    declineAthleteRequest: async(athleteId:string) => {
        const userId = await UserService.getUserId();
        return await API.delete(`${EXPO_PUBLIC_API_URL}/coaches/decline_athlete_request?coachId=${userId}&athleteId=${athleteId}`);
    }
}

export default CoachService;