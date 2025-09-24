import API from "./API";
import UserService from "./UserService";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const AthleteWorkoutService = {
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
    },
    removeInputs: async (inputIds:number[]) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/remove_inputs`,
            {
                'inputIds': inputIds
            }
        );
    }
}

export default AthleteWorkoutService;