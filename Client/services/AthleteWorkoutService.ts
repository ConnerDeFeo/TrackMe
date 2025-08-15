import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const AthleteWorkoutService = {
    viewWorkout: async (groupId:string, date:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athlete/view_workout_athlete?groupId=${groupId}&date=${date}`);
    }
}

export default AthleteWorkoutService;