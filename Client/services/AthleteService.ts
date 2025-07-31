import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const AthleteService = {
    //Creates athlete
    createAthlete: async (athleteData:Record<string, string>) => {
        console.log(EXPO_PUBLIC_API_URL);
        const response = await API.post(`${EXPO_PUBLIC_API_URL}/athletes/create_athlete`, athleteData);
        if (!response.ok) {
            throw new Error('Failed to create athlete');
        }
        return await response.json();
    } 
}

export default AthleteService;