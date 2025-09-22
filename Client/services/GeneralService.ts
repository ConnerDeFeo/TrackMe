import { fetchUserAttributes } from "aws-amplify/auth";
import API from "./API";
import UserService from "./UserService";
import AsyncStorage from "./AsyncStorage";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const GeneralService = {
  getGroups: async () => {
    const userAttributes = await fetchUserAttributes();
    const userId = await UserService.getUserId();
    const accountType = userAttributes['custom:accountType'];
    return API.get(`${EXPO_PUBLIC_API_URL}/general/get_groups?userId=${userId}&accountType=${accountType}`);
  },
  getAthletesForGroup: async (groupId:string) => {
      return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_athletes_for_group?groupId=${groupId}`);
  },
  viewGroupInputs: async (groupId:string, date?:string) => {
      let query = `${EXPO_PUBLIC_API_URL}/general/view_group_inputs?groupId=${groupId}`;
      if(date){
          query += `&date=${date}`;
      }
      return await API.get(query);
  },
  getUser: async (userId: string) => {
    const accountType = await AsyncStorage.getData('accountType');
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_user?userId=${userId}&accountType=${accountType}`);
  },
  updateUserProfile: async (userData: Record<string, any>, accountType: string) => {
    accountType = accountType.toLowerCase();
    const userId = await UserService.getUserId();
    if(userId){
      userData[`${accountType}Id`] = userId;
    }
    const routeMapping:Record<string,string> = {
      'athlete': 'athletes',
      'coach': 'coaches'
    };
    return await API.post(`${EXPO_PUBLIC_API_URL}/${routeMapping[accountType]}/update_${accountType}_profile`, userData);
  },
  removeCoachAthlete: async (targetId:string) => {
    const userId = await UserService.getUserId();
    const accountType = await AsyncStorage.getData('accountType');
    if(accountType === 'Coach'){
      return await API.delete(`${EXPO_PUBLIC_API_URL}/general/remove_coach_athlete?coachId=${userId}&athleteId=${targetId}`);
    }
    return await API.delete(`${EXPO_PUBLIC_API_URL}/general/remove_coach_athlete?athleteId=${userId}&coachId=${targetId}`);
  },
  getGroupWorkout: async (groupId:string, date?:string) => {
    let request = `${EXPO_PUBLIC_API_URL}/general/get_group_workout?&groupId=${groupId}`;
    if(date){
      request += `&date=${date}`;
    }
    return await API.get(request);
  },
  getPendingProposals: async () => {
    const userId = await UserService.getUserId();
    const accountType = await AsyncStorage.getData('accountType');
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_pending_proposals?userId=${userId}&accountType=${accountType}`);
  },
  massInput: async (athleteData: Record<string, { time?: string | undefined; distance?: string | undefined}[]>, groupId:string, date?: string) => {
    return await API.post(`${EXPO_PUBLIC_API_URL}/general/mass_input`, {
      athleteData,
      groupId,
      date
    });
  }
};

export default GeneralService;