import { fetchUserAttributes } from "aws-amplify/auth";

const UserService = {
  getAccountType: async () => {
    const user = await fetchUserAttributes();
    if(user)
        return user['custom:accountType'];
    return null;
  },
};

export default UserService;