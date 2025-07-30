import API from "./API";

const AthleteService = {
    //Creates athlete
    createAthlete: async (athleteData:Record<string, string>) => {
        const response = await API.post('http://localhost:3000/athletes/create_athlete', athleteData);
        if (!response.ok) {
            throw new Error('Failed to create athlete');
        }
        return await response.json();
    } 
}

export default AthleteService;