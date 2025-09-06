const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
import API from "./API";

const HistoryService = {
    getWorkoutHistory: async (athleteId: string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/view_input_history?athleteId=${athleteId}`);
    }
};

export default HistoryService;