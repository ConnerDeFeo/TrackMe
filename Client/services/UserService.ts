import { fetchUserAttributes, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import AsyncStorage from "./AsyncStorage";
import { useNavigation } from "@react-navigation/native";



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
      await AsyncStorage.removeData("accountType");
      await AsyncStorage.removeData("userId");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  },
  //signs user in and navigates to their respective home page
  signIn: async (username: string, password: string) => {
    const navigation = useNavigation<any>();
    try {
      await signIn({ username, password });
      const user = await getCurrentUser();
      const accountType = await UserService.getAccountType();
      AsyncStorage.storeData('accountType', accountType!);
      AsyncStorage.storeData('userId', user.userId);
      navigation.navigate(`${accountType}Groups`);
    } catch (error) {
      console.log("Error signing in:", error);
    }
  }
};

export default UserService;