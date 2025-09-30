import AuthInput from "../../components/authentication/AuthInput";
import { Text, Pressable, View } from "react-native";
import { useContext, useState } from "react";
import UserService from "../../services/UserService";
import { fetchUserAttributes  } from "aws-amplify/auth";
import AuthenticationHeader from "../../components/authentication/AuthenticationHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { AccountType } from "../../assets/constants/Enums";

//Create account page
const SignIn = ()=>{
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { resetPasswordMessage } = route.params as { resetPasswordMessage?: string } || {};
    const [showResetPasswordMessage, setShowResetPasswordMessage] = useState<boolean>(!!resetPasswordMessage);
    const authContext = useContext(AuthContext);
    const [accountType, setAccountType] = authContext;

    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [error,setError] = useState<string>("");

    const handleError = async (error:any) => {
        setShowResetPasswordMessage(false);
        if (error.name==="UserUnAuthenticatedException" && username) {
            navigation.navigate("Auth", { screen: 'ConfirmEmail', params:{username:username, password:password, accountType:""} });
            return;
        }
        setError(error.message);
    }

    //Function to handle sign in
    const handleSignIn = async () => {
        try{
            await UserService.signIn(username,password);
            const attribute = await fetchUserAttributes();
            const accountType = attribute['custom:accountType'];
            if(accountType === AccountType.Athlete || accountType === AccountType.Coach){
                setAccountType(accountType);
                return;
            }
            setError("Account type not recognized. Please contact support.");
        }catch (error:any) {
            handleError(error);
        }
    }

    const handleCreateAccountButtonPress = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'CreateAccount' }],
        });
    }

    return(
        <View className="relative h-full w-[85%] mx-auto">
            <AuthenticationHeader/>
            {/**Success Message from reset password*/}
            {showResetPasswordMessage && <Text className="text-green-500 text-center absolute top-[19rem] left-0 right-0">{resetPasswordMessage}</Text>}
            <View className="m-auto gap-y-6 w-full">
                {/**SIGN IN*/}
                <Text className="text-red-500 text-center mt-100">{error}</Text>
                <View className="gap-y-4 bg-red-200 rounded-xl p-6">
                    <AuthInput value={username} setValue={setUsername} placeholder="Username or Email"/>
                    <View className="gap-y-2">
                        <AuthInput value={password} setValue={setPassword} placeholder="Password" sensitive={true}/>
                        <Pressable onPress={()=>navigation.reset({index: 0, routes: [{ name: "ForgotPassword" }],})}>
                            <Text className="text-right">Forgot Password?</Text>
                        </Pressable>
                    </View>
                    <Pressable onPress={handleSignIn} className="bg-black rounded-lg py-3">
                        <Text className="text-white text-xl font-bold text-center">Login</Text>
                    </Pressable>
                </View>
                {/**CREATE NEW ACCOUNT*/}
                <View className="gap-y-4">
                    <Text className="text-center text-xl">Don't have an account? </Text>
                    <Pressable onPress={handleCreateAccountButtonPress} className="trackme-bg-red rounded-lg py-3">
                        <Text className="text-white text-xl font-bold text-center">Create Account</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default SignIn;