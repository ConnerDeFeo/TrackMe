import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachWorkoutService = {
    createWorkout: async (workoutData:any) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_workout`, workoutData);
    },
    getWorkouts: async (coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_workouts?coachId=${coachId}`);
    },
    assignWorkoutToGroup: async (workoutId:string, coachId: string, groupId:string) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/assign_group_workout`, { workoutId:workoutId, coachId:coachId, groupId: groupId });
    },
    getGroupWorkout: async (coachId:string, groupId:string, date:string) => {
        let request = `${EXPO_PUBLIC_API_URL}/coaches/get_group_workout?coachId=${coachId}&groupId=${groupId}&date=${date}`;
        return await API.get(request);
    },
    deleteWorkout: async (workoutId:string, coachId:string) => {
        return await API.delete(`${EXPO_PUBLIC_API_URL}/coaches/delete_workout?workoutId=${workoutId}&coachId=${coachId}`);
    }
}

export default CoachWorkoutService;