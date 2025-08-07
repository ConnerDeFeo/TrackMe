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
    }
}

export default CoachService;