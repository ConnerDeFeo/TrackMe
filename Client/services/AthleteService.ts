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
    } 
}

export default AthleteService;