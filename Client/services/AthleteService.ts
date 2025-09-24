import API from "./API";
import UserService from "./UserService";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const AthleteService = {
    //Creates athlete
    createAthlete: async () => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/create_athlete`);
    },
    getCoaches: async () => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/get_coaches`);
    },
    getCoachInvites: async () => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/get_coach_invites`);
    },
    acceptCoachInvite: async(coachId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/accept_coach_invite`,
            {
                'coachId': coachId
            }
        );
    },
    searchCoaches: async (searchTerm:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/search_coaches?searchTerm=${searchTerm}`);
    },
    requestCoach: async ( coachId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/request_coach`,
            {
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