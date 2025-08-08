import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachGroupService = {
    createGroup: async (coachId:string, groupName:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_group`, 
            { 
                'userId': coachId, 
                'groupName': groupName 
            }
        );
    },
    getAthletesForGroup: async (groupId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_athletes_for_group?groupId=${groupId}`);
    },
    add_athlete_to_group: async (athleteId:string, groupId:string, coachId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/add_athlete_to_group`, 
            { 
                'athleteId': athleteId, 
                'groupId': groupId,
                'coachId': coachId
            }
        );
    }

}

export default CoachGroupService;