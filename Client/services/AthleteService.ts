import API from "./API";
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
    getCoachRequests: async (userId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/get_coach_requests?userId=${userId}`);
    },
    acceptCoachInvite: async(userId:string, coachId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/accept_coach_invite`,
            {
                'athleteId': userId,
                'coachId': coachId
            }
        );
    }
}

export default AthleteService;