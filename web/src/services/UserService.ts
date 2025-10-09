import { fetchUserAttributes, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { AccountType } from "../common/constants/Enums";
const UserService = {
    //signs user in and navigates to their respective home page
    signIn: async (username: string, password: string) => {
        return await signIn({ username, password }); //Throws error if sign in fails, so no need to handle it here
    },
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
        await signOut();
        } catch (error) {
        console.log("Error signing out:", error);
        }
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
}

export default UserService;