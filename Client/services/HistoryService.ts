const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
import API from "./API";

const HistoryService = {
    getWorkoutHistory: async (athleteId: string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/view_input_history?athleteId=${athleteId}`);
    },
    searchInputHistoryByDate: async (athleteId: string, date: string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/athletes/search_input_history_date?athleteId=${athleteId}&date=${date}`);
    }
};

export default HistoryService;