import API from "./API";
import UserService from "./UserService";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const AthleteService = {
    //Creates athlete
    createAthlete: async (userId:string, username:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/create_athlete`,
            { 
                'userId': userId, 
                'username': username 
            }
        );
    },
    getCoaches: async (userId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/get_coaches?userId=${userId}`);
    },
    getCoachInvites: async (userId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/get_coach_invites?userId=${userId}`);
    },
    acceptCoachInvite: async(userId:string, coachId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/accept_coach_invite`,
            {
                'athleteId': userId,
                'coachId': coachId
            }
        );
    },
    searchCoaches: async (userId:string, searchTerm:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/search_coaches?athleteId=${userId}&searchTerm=${searchTerm}`);
    },
    requestCoach: async (userId:string, coachId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/request_coach`,
            {
                'athleteId': userId,
                'coachId': coachId
            }
        );
    },
    declineCoachInvite: async(coachId:string) => {
        const userId = await UserService.getUserId();
        return await API.delete(`${EXPO_PUBLIC_API_URL}/athletes/decline_coach_invite?athleteId=${userId}&coachId=${coachId}`);
    }
}

export default AthleteService;