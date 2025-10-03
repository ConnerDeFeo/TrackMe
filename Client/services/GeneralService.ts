import { AccountType } from "../assets/constants/Enums";
import { Input } from "../types/inputs/Input";
import API from "./API";
import DateService from "./DateService";
import UserService from "./UserService";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const GeneralService = {
  getGroups: async () => {
    return API.get(`${EXPO_PUBLIC_API_URL}/general/get_groups`);
  },
  getAthletesForGroup: async (groupId:string) => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_athletes_for_group?groupId=${groupId}`);
  },
  viewGroupInputs: async (groupId:string, date?:string) => {
      date ??= DateService.formatDate(new Date()); 
      const query = `${EXPO_PUBLIC_API_URL}/general/view_group_inputs?groupId=${groupId}&date=${date}`;
      return await API.get(query);
  },
  getUser: async () => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_user`);
  },
  updateUserProfile: async (userData: Record<string, any>, accountType: string) => {
    accountType = accountType.toLowerCase();
    const routeMapping:Record<string,string> = {
      'athlete': 'athletes',
      'coach': 'coaches'
    };
    return await API.post(`${EXPO_PUBLIC_API_URL}/${routeMapping[accountType]}/update_${accountType}_profile`, userData);
  },
  removeCoachAthlete: async (targetId:string) => {
    const userId = await UserService.getUserId();
    const accountType = await UserService.getAccountType();
    if(accountType===AccountType.Athlete){
      return await API.delete(`${EXPO_PUBLIC_API_URL}/general/remove_coach_athlete?athleteId=${userId}&coachId=${targetId}`);
    }
    return await API.delete(`${EXPO_PUBLIC_API_URL}/general/remove_coach_athlete?athleteId=${targetId}&coachId=${userId}`);
  },
  getGroupWorkout: async (groupId:string, date?:string) => {
    let request = `${EXPO_PUBLIC_API_URL}/general/get_group_workout?&groupId=${groupId}`;
    if(date){
      request += `&date=${date}`;
    }
    return await API.get(request);
  },
  getPendingProposals: async () => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_pending_proposals`);
  },
  massInput: async (athleteData: Record<string, Input[]>, groupId:string, date?: string) => {
    return await API.post(`${EXPO_PUBLIC_API_URL}/general/mass_input`, {
      athleteData,
      groupId,
      date
    });
  },
  getWeeklyGroupSchedule: async (groupId:string, startDate:string) => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_weekly_schedule?groupId=${groupId}&startDate=${startDate}`);
  }
};

export default GeneralService;