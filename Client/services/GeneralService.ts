import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { Input } from "../common/types/inputs/Input";
import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const GeneralService = {
  getGroups: async () => {
    return API.get(`${EXPO_PUBLIC_API_URL}/general/get_groups`);
  },
  getAthletesForGroup: async (groupId:string) => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_athletes_for_group?groupId=${groupId}`);
  },
  getUser: async () => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_user`);
  },
  updateUserProfile: async (userData: Record<string, any>) => {
    return await API.post(`${EXPO_PUBLIC_API_URL}/general/update_user_profile`, userData);
  },
  getGroupWorkout: async (groupId:string, date?:string) => {
    let request = `${EXPO_PUBLIC_API_URL}/general/get_group_workout?&groupId=${groupId}`;
    if(date){
      request += `&date=${date}`;
    }
    return await API.get(request);
  },
  massInput: async (athleteData: Record<string, Input[]>, date?: string) => {
    return await API.post(`${EXPO_PUBLIC_API_URL}/general/mass_input`, {
      athleteData,
      date
    });
  },
  getWeeklyGroupSchedule: async (groupId:string, startDate:string) => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_weekly_schedule?groupId=${groupId}&startDate=${startDate}`);
  },
  createUser: async () => {
    return await API.post(`${EXPO_PUBLIC_API_URL}/general/create_user`);
  },
  getMutualInputs: async (date?: string) => {
    let request = `${EXPO_PUBLIC_API_URL}/general/get_mutual_inputs`;
    if (date) {
      request += `?date=${date}`;
    }
    return await API.get(request);
  },
};

export default GeneralService;