import AuthInput from "../../components/authentication/AuthInput";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { fetchUserAttributes  } from "aws-amplify/auth";
import AuthenticationHeader from "../../components/authentication/AuthenticationHeader";
import AsyncStorage from "../../services/AsyncStorage";
import { useNavigation, useRoute } from "@react-navigation/native";

//Create account page
const SignIn = ()=>{
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { resetPasswordMessage } = route.params as { resetPasswordMessage?: string } || {resetPasswordMessage:"testing"};
    const [showResetPasswordMessage, setShowResetPasswordMessage] = useState<boolean>(!!resetPasswordMessage);

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
            navigation.replace("User",{"Screen":`${accountType}Groups`});
        }catch (error:any) {
            handleError(error);
        }
    }

    useEffect(() => {
        async function checkUser() {
            const accountType = await UserService.getAccountType();
            const userId = await UserService.getUserId();
            if (accountType) {
                AsyncStorage.storeData('accountType', accountType);
                AsyncStorage.storeData('userId', userId!);
                navigation.replace("User",{"Screen":`${accountType}Groups`});
                return;
            }
        }
        checkUser();
    }, [navigation]);

    console.log(resetPasswordMessage)
    return(
        <View className="relative h-full w-[85%] mx-auto">
            <AuthenticationHeader/>
            {/**Success Message from reset password*/}
            {showResetPasswordMessage && <Text className="text-green-500 text-center absolute top-[19rem] left-0 right-0">{resetPasswordMessage}</Text>}
            <View className="m-auto gap-y-10 w-full">
                {/**SIGN IN*/}
                <Text className="text-red-500 text-center mt-100">{error}</Text>
                <View className="gap-y-4 bg-red-200 rounded-xl p-6">
                    <AuthInput value={username} setValue={setUsername} placeholder="Username or Email"/>
                    <View className="gap-y-2">
                        <AuthInput value={password} setValue={setPassword} placeholder="Password" sensitive={true}/>
                        <TouchableOpacity onPress={()=>navigation.replace("Auth", {screen:'ForgotPassword'})}>
                            <Text className="text-right">Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <Button title="Login" onPress={handleSignIn} color="black"/>
                </View>
                {/**CREATE NEW ACCOUNT*/}
                <View className="gap-y-6">
                    <Text className="text-center text-xl">Don't have an account? </Text>
                    <Button title="Create Account" onPress={()=>navigation.replace("Auth", {screen:'CreateAccount'})} color="#E63946"/>
                </View>
            </View>
        </View>
    );
}

export default SignIn;