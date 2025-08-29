import { fetchUserAttributes, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import AsyncStorage from "./AsyncStorage";

const UserService = {
  //gets the account type of the currently signed in user
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
  //signs user out and clears session data
  signOut: async () => {
    try {
      await signOut();
      await AsyncStorage.clear();
    } catch (error) {
      console.log("Error signing out:", error);
    }
  },
  //signs user in and navigates to their respective home page
  signIn: async (username: string, password: string) => {
    await AsyncStorage.clear();
    await signIn({ username, password });
    const user = await getCurrentUser();
    const accountType = await UserService.getAccountType();
    AsyncStorage.storeData('accountType', accountType!);
    AsyncStorage.storeData('userId', user.userId);
  },
  getUserId: async () => {
    try {
      const user = await getCurrentUser();
      return user.userId;
    } catch (error) {
      console.log("Error fetching user ID:", error);
      return null;
    }
  },
  getUsername: async () => {
    try {
      const user = await getCurrentUser();
      return user.username;
    } catch (error) {
      console.log("Error fetching username:", error);
      return null;
    }
  }
};

export default UserService;