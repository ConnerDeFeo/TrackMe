import API from "./API";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const HistoryService = {
    getAvailableHistoryDates: async (yyyyMM: string, distanceFilters?: string[]) => {
        let url = `${VITE_API_URL}/history/get_available_history_dates?date=${yyyyMM}`;
        if (distanceFilters && distanceFilters.length > 0) {
            url += `&distanceFilters=${distanceFilters.join(",")}`;
        }
        return await API.get(url);
    },
    fetchHistoricalData: async (date: string) => {
        return await API.get(`${VITE_API_URL}/history/fetch_historical_data?date=${date}`);
    },
    getEarliestDateAvailable: async () => {
        return await API.get(`${VITE_API_URL}/history/get_earliest_date_available`);
    }
};

export default HistoryService;