import API from "./API";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const HistoryService = {
    searchInputHistoryByDate: async (date?: string) => {
        let url = `${VITE_API_URL}/athletes/search_input_history_date`;
        if(date) {
            url += `?date=${date}`;
        }
        return await API.get(url);
    },
    getAvailableHistoryDates: async (date?: string) => {
        let url = `${VITE_API_URL}/coaches/get_available_history_dates`;
        if (date) {
            url += `?date=${date}`;
        }
        return await API.get(url); 
    },
    fetchHistoricalData: async (date: string) => {
        return await API.get(`${VITE_API_URL}/coaches/fetch_historical_data?date=${date}`);
    }
};

export default HistoryService;