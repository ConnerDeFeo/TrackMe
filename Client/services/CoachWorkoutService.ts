import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const CoachWorkoutService = {
    createWorkoutTemplate: async (workoutData:any) => {
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/create_workout_template`, workoutData);
    },
    getWorkoutTemplates: async (coachId:string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/get_workout_templates?coachId=${coachId}`);
    },
    assignWorkoutTemplateToGroup: async (workoutId:string,groupId:string, date?: string) => {
        const payload: Record<string, any> = { workoutId:workoutId, groupId: groupId };
        if(date){
            payload['date'] = date;
        }
        console.log("Assigning workout template to group with payload:", payload);
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/assign_group_workout_template`, payload);
    },
    deleteWorkoutTemplate: async (workoutId:string, coachId:string) => {
        return await API.delete(`${EXPO_PUBLIC_API_URL}/coaches/delete_workout_template?workoutId=${workoutId}&coachId=${coachId}`);
    },
    deleteGroupWorkout: async (groupWorkoutId:string) => {
        return await API.delete(`${EXPO_PUBLIC_API_URL}/coaches/delete_group_workout?groupWorkoutId=${groupWorkoutId}`);
    },
    assignGroupWorkout: async (groupId:string, workoutData:any) => {
        const payload: Record<string, any> = { 
                'groupId': groupId, 
                'title': workoutData.title,
                'description': workoutData.description,
                'exercises': workoutData.exercises,
            };
        if (workoutData.workoutId){
            payload['workoutId'] = workoutData.workoutId;
        }
        return await API.post(`${EXPO_PUBLIC_API_URL}/coaches/assign_group_workout`, payload);
    }
}

export default CoachWorkoutService;