const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
import API from "./API";

const HistoryService = {
    getAvailableHistoryDates: async (date?: string) => {
        let url = `${EXPO_PUBLIC_API_URL}/history/get_available_history_dates`;
        if (date) {
            url += `?date=${date}`;
        }
        return await API.get(url);
    },
    fetchHistoricalData: async (date: string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/history/fetch_historical_data?date=${date}`);
    }
};

export default HistoryService;