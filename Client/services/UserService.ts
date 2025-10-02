import { fetchUserAttributes, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { AccountType } from "../assets/constants/Enums";
import AsyncStorage from "@react-native-async-storage/async-storage";
const UserService = {
  //gets the account type of the currently signed in user
  getAccountType: async (): Promise<AccountType> => {
    try {
      const user = await fetchUserAttributes();
      if(user && (user['custom:accountType'] === AccountType.Athlete || user['custom:accountType'] === AccountType.Coach)){
        return user['custom:accountType'] as AccountType;
      }
      return AccountType.SignedOut;
    } catch (error) {
      return AccountType.SignedOut;
    }
  },
  //signs user out and clears session data
  signOut: async () => {
    try {
      await AsyncStorage.clear(); // Clear all stored data on sign out
      await signOut();
    } catch (error) {
      console.log("Error signing out:", error);
    }
  },
  //signs user in and navigates to their respective home page
  signIn: async (username: string, password: string) => {
    await AsyncStorage.clear(); // Clear all stored data on sign out
    await signIn({ username, password }); //Throws error if sign in fails, so no need to handle it here
  },
  getUserId: async () => {
    try {
      const user = await getCurrentUser();
      return user.userId;
    } catch (error) {
      return null;
    }
  },
  getUsername: async () => {
    try {
      const user = await getCurrentUser();
      return user.username;
    } catch (error) {
      return null;
    }
  }
};

export default UserService;