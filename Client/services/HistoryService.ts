const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
import API from "./API";

const HistoryService = {
    searchInputHistoryByDate: async (athleteId: string, date?: string) => {
        let url = `${EXPO_PUBLIC_API_URL}/athletes/search_input_history_date?athleteId=${athleteId}`;
        if (date) {
            url += `&date=${date}`;
        }
        return await API.get(url);
    },
    getAvailableHistoryDates: async (coachId: string, date?: string) => {
        let url = `${EXPO_PUBLIC_API_URL}/coaches/get_available_history_dates?coachId=${coachId}`;
        if (date) {
            url += `&date=${date}`;
        }
        return await API.get(url);
    }
};

export default HistoryService;