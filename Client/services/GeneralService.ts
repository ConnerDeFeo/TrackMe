import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const GeneralService = {
  getGroups: async () => {
    const user = await getCurrentUser();
    const userAttributes = await fetchUserAttributes();
    const userId = user.userId;
    const accountType = userAttributes['custom:accountType'];
    return API.get(`${EXPO_PUBLIC_API_URL}/general/get_groups?userId=${userId}&accountType=${accountType}`);
  },
};

export default GeneralService;