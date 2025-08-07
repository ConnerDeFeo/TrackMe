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

}

export default CoachGroupService;