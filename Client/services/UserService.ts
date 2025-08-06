import { fetchUserAttributes } from "aws-amplify/auth";

const UserService = {
  getAccountType: async () => {
    try {
      const user = await fetchUserAttributes();
      if(user)
          return user['custom:accountType'];
      return null;
    } catch (error) {
      console.log("Error fetching user attributes:", error);
      return null;
    }
  },
};

export default UserService;