import API from "./API";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const CoachWorkoutService = {
    createWorkoutTemplate: async (workoutData:any) => {
        return await API.post(`${VITE_API_URL}/coaches/create_workout_template`, workoutData);
    },
    getWorkoutTemplates: async () => {
        return await API.get(`${VITE_API_URL}/coaches/get_workout_templates`);
    },
    getWorkout: async (workoutId:string) => {
        return await API.get(`${VITE_API_URL}/coaches/get_workout?workoutId=${workoutId}`);
    },
    assignWorkoutTemplateToGroup: async (workoutId:string,groupId:string, date?: string) => {
        const payload: Record<string, any> = { workoutId, groupId };
        if(date){
            payload['date'] = date;
        }
        return await API.post(`${VITE_API_URL}/coaches/assign_group_workout_template`, payload);
    },
    deleteWorkoutTemplate: async (workoutId:string) => {
        return await API.delete(`${VITE_API_URL}/coaches/delete_workout_template?workoutId=${workoutId}`);
    },
    deleteGroupWorkout: async (groupWorkoutId:string) => {
        return await API.delete(`${VITE_API_URL}/coaches/delete_group_workout?groupWorkoutId=${groupWorkoutId}`);
    },
    assignGroupWorkout: async (groupId:string, workoutData:any, date:string) => {
        const payload: Record<string, any> = { 
                'groupId': groupId, 
                'title': workoutData.title,
                'description': workoutData.description,
                'sections': workoutData.sections,
                'date': date
            };
        if (workoutData.workoutId){
            payload['workoutId'] = workoutData.workoutId;
        }
        if (workoutData.groupWorkoutId){
            payload['groupWorkoutId'] = workoutData.groupWorkoutId;
        }
        return await API.post(`${VITE_API_URL}/coaches/assign_group_workout`, payload);
    },
    bedrockWorkoutGeneration: async (userPrompt:string) => {
        return await API.post(`${VITE_API_URL}/coaches/bedrock_workout_generation`, { userPrompt });
    }
}

export default CoachWorkoutService;