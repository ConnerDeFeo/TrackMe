import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachWorkoutService = {
    createWorkout: async (workoutData:any) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_workout`, workoutData);
    },
    getWorkouts: async (coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_workouts?coach_id=${coachId}`);
    },
    assignWorkoutToGroup: async (title:string, coachId: string, groupId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/assign_group_workout`, { title:title, userId:coachId, groupId: groupId });
    }
}

export default CoachWorkoutService;