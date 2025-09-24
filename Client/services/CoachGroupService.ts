import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachGroupService = {
    createGroup: async (groupName:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_group`, 
            { 
                'groupName': groupName 
            }
        );
    },
    getAbsentGroupAthletes: async (groupId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_absent_group_athletes?groupId=${groupId}`);
    },
    add_athlete_to_group: async (athleteId:string, groupId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/add_athlete_to_group`, 
            { 
                'athleteId': athleteId, 
                'groupId': groupId
            }
        );
    },
    removeAthleteFromGroup: async (athleteId:string, groupId:string) => {
        return await API.delete(`${EXPO_PUBLIC_API_URL}/coaches/remove_group_athlete?athleteId=${athleteId}&groupId=${groupId}`);
    },
    deleteGroup: async (groupId:string) => {
        return await API.delete(`${EXPO_PUBLIC_API_URL}/coaches/delete_group?groupId=${groupId}`);
    }
}

export default CoachGroupService;