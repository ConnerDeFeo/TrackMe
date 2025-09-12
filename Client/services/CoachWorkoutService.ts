import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachWorkoutService = {
    createWorkout: async (workoutData:any) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_workout`, workoutData);
    },
    getWorkouts: async (coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_workouts?coachId=${coachId}`);
    },
    assignWorkoutToGroup: async (workoutId:string,groupId:string, date?: string) => {
        const payload: Record<string, any> = { workoutId:workoutId, groupId: groupId };
        if(date){
            payload['date'] = date;
        }
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/assign_group_workout`, payload);
    },
    deleteWorkout: async (workoutId:string, coachId:string) => {
        return await API.delete(`${EXPO_PUBLIC_API_URL}/coaches/delete_workout?workoutId=${workoutId}&coachId=${coachId}`);
    }
}

export default CoachWorkoutService;