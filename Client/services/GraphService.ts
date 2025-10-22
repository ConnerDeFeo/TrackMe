const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
import API from "./API";

const GraphService = {
    getWorkRestRatio: async (date: string) => {
        return API.get(`${EXPO_PUBLIC_API_URL}/graph/get_work_rest_ratio?date=${date}`);
    }
}

export default GraphService;