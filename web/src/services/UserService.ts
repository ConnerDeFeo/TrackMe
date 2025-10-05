import { fetchUserAttributes, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
const UserService = {
    //signs user in and navigates to their respective home page
    signIn: async (username: string, password: string) => {
        await signIn({ username, password }); //Throws error if sign in fails, so no need to handle it here
    },
}

export default UserService;