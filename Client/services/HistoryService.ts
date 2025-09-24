const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
import API from "./API";

const HistoryService = {
    searchInputHistoryByDate: async (date?: string) => {
        let url = `${EXPO_PUBLIC_API_URL}/athletes/search_input_history_date`;
        if(date) {
            url += `?date=${date}`;
        }
        return await API.get(url);
    },
    getAvailableHistoryDates: async (date?: string) => {
        let url = `${EXPO_PUBLIC_API_URL}/coaches/get_available_history_dates`;
        if (date) {
            url += `&date=${date}`;
        }
        return await API.get(url);
    },
    fetchHistoricalData: async (date: string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/coaches/fetch_historical_data?date=${date}`);
    }
};

export default HistoryService;