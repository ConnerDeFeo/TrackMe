import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const AthleteWorkoutService = {
    viewWorkout: async (groupId:string, date?:string) => {
        let query = `${EXPO_PUBLIC_API_URL}/athletes/view_workout_athlete?groupId=${groupId}`;
        if (date) {
            query += `&date=${date}`;
        }
        return await API.get(query);
    }
}

export default AthleteWorkoutService;