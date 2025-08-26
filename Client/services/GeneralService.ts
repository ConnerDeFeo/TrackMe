import { fetchUserAttributes } from "aws-amplify/auth";
import API from "./API";
import UserService from "./UserService";
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
};

export default GeneralService;