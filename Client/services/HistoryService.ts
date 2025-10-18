const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
import API from "./API";

const HistoryService = {
    getAvailableHistoryDates: async (startDate:string, endDate:string) => {
        let url = `${EXPO_PUBLIC_API_URL}/history/get_available_history_dates`;
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        return await API.get(url);
    },
    fetchHistoricalData: async (date: string) => {
        return await API.get(`${EXPO_PUBLIC_API_URL}/history/fetch_historical_data?date=${date}`);
    }
};

export default HistoryService;