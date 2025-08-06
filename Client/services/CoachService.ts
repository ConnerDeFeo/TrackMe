import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachService = {
    //Creates coach
    createCoach: async (userId:string, username:string) => {
        const response = await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_coach`,
            { 
                'userId': userId, 
                'username': username 
            }
        );
        if (!response.ok) {
            throw new Error('Failed to create coach');
        }
        return await response.json();
    } 
}

export default CoachService;