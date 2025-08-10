import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachWorkoutService = {
    createWorkout: async (workoutData:any) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_workout`, workoutData);
    },
    getWorkouts: async (coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_workouts?coach_id=${coachId}`);
    }
}

export default CoachWorkoutService;