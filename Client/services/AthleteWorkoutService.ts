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
        let query = `${EXPO_PUBLIC_API_URL}/athletes/view_workout_inputs?athleteId=${userId}`;
        return await API.get(query);
    },
    inputTimes: async ( athleteIds:string[], groupId:string, date:string, inputs: { time?: string; distance?: string }[]) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/input_times`, {
            'athleteIds': athleteIds,
            'groupId': groupId,
            'date': date,
            'inputs': inputs
        });
    }
}

export default AthleteWorkoutService;