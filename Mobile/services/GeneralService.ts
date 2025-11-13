import { Input } from "../common/types/inputs/Input";
import API from "./API";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const GeneralService = {
  getUser: async (userId: string) => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/get_user?userId=${userId}`);
  },
  updateUserProfile: async (userData: Record<string, any>) => {
    return await API.post(`${EXPO_PUBLIC_API_URL}/general/update_user_profile`, userData);
  },
  massInput: async (athleteData: Record<string, Input[]>, date?: string) => {
    return await API.post(`${EXPO_PUBLIC_API_URL}/general/mass_input`, {
      athleteData,
      date
    });
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
  generatePresignedS3Url: async (title: string, destination: "profilePicture" | "videos") => {
    return await API.get(`${EXPO_PUBLIC_API_URL}/general/generate_presigned_s3_url?title=${title}&destination=${destination}`);
  }
};

export default GeneralService;