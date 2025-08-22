import API from "./API";
import UserService from "./UserService";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const AthleteWorkoutService = {
    viewWorkouts: async (groupId:string, date?:string) => {
        let query = `${EXPO_PUBLIC_API_URL}/athletes/view_workouts_athlete?groupId=${groupId}`;
        if (date) {
            query += `&date=${date}`;
        }
        return await API.get(query);
    },
    viewWorkoutInputs: async() =>{
        const userId = await UserService.getUserId();
        const username = await UserService.getUsername();
        let query = `${EXPO_PUBLIC_API_URL}/athletes/view_workout_inputs?userId=${userId}&username=${username}`;
        return await API.get(query);
    },
    inputTimes: async ( groupId:string, date:string, inputs: { time?: string; distance?: string }[]) => {
        const athleteId = await UserService.getUserId();
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/input_times`, {
            'athleteId': athleteId,
            'groupId': groupId,
            'date': date,
            'inputs': inputs
        });
    }
}

export default AthleteWorkoutService;