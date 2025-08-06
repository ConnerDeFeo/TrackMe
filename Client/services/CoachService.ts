import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachService = {
    //Creates coach
    createCoach: async (coachData:Record<string, string>) => {
        console.log(EXPO_PUBLIC_API_URL);
        const response = await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_coach`, coachData);
        if (!response.ok) {
            throw new Error('Failed to create coach');
        }
        return await response.json();
    } 
}

export default CoachService;