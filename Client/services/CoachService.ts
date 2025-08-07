import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachService = {
    //Creates coach
    createCoach: async (userId:string, username:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_coach`,
            { 
                'userId': userId, 
                'username': username 
            }
        );
    },
    createGroup: async (coachId:string, groupName:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_group`, 
            { 
                'userId': coachId, 
                'groupName': groupName 
            }
        );
    },
    searchAthletes: async (searchTerm:string, coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/search_athletes?searchTerm=${searchTerm}&coachId=${coachId}`);
    },
    inviteAthlete: async (athleteId:string, coachId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/invite_athlete`, 
            { 
                'athleteId': athleteId,
                'coachId': coachId
            }
        );
    },
    getAthletes: async (coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_athletes?coachId=${coachId}`);
    }
}

export default CoachService;