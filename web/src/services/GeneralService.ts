import API from "./API";
const VITE_API_URL = import.meta.env.VITE_API_URL;

const GeneralService = {
  getUser: async () => {
    return await API.get(`${VITE_API_URL}/general/get_user`);
  },
  updateUserProfile: async (userData: Record<string, any>) => {
    return await API.post(`${VITE_API_URL}/general/update_user_profile`, userData);
  },
  createUser: async () => {
    return await API.post(`${VITE_API_URL}/general/create_user`);
  }
};

export default GeneralService;