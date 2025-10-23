import { Input } from "../common/types/inputs/Input";
import API from "./API";
import UserService from "./UserService";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const AthleteWorkoutService = {
    viewWorkoutInputs: async(date:string) =>{
        const userId = await UserService.getUserId();
        let query = `${EXPO_PUBLIC_API_URL}/athletes/view_workout_inputs?athleteId=${userId}&date=${date}`;
        return await API.get(query);
    },
    inputTimes: async ( athleteIds:string[],  date:string, inputs: Input[]) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/input_times`, {
            'athleteIds': athleteIds,
            'date': date,
            'inputs': inputs
        });
    },
    removeInputs: async (inputIds:{inputId: number, type: string}[]) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/athletes/remove_inputs`,
            {
                'inputIds': inputIds
            }
        );
    }
}

export default AthleteWorkoutService;