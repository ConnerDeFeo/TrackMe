import AuthInput from "../../components/AuthInput";
import { Button, Image, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import UserService from "../../services/UserService";
import { fetchUserAttributes } from "aws-amplify/auth";
import AuthenticationHeader from "../../components/AuthenticationHeader";
import AsyncStorage from "../../services/AsyncStorage";

//Create account page
const SignIn = ()=>{
    const navigation = useNavigation<any>();

    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [error,setError] = useState<string>("");

    //Function to handle sign in
    const handleSignIn = async () => {
        try{
            await UserService.signIn(username,password);
            const attribute = await fetchUserAttributes();
            const accountType = attribute['custom:accountType'];
            if(accountType) {
                navigation.replace(`${accountType}Groups`);
            }
        }catch (error:any) {
            setError(error.message);
        }
    }

    useEffect(() => {
        async function checkUser() {
            const accountType =await UserService.getAccountType();
            const userId = await UserService.getUserId();
            if (accountType) {
                AsyncStorage.storeData('accountType', accountType);
                AsyncStorage.storeData('userId', userId!);
                navigation.replace(`${accountType}Groups`);
                return;
            }
        }
        checkUser();
    }, [navigation]);

    return(
        <View className="relative h-full w-[85%] mx-auto">
            <AuthenticationHeader/>
            <View className="m-auto gap-y-10 w-full">
                {/**SIGN IN*/}
                <Text className="text-red-500 text-center mt-100">{error}</Text>
                <View className="gap-y-8 bg-red-200 rounded-xl p-6">
                    <AuthInput value={username} setValue={setUsername} placeholder="Username"/>
                    <AuthInput value={password} setValue={setPassword} placeholder="Password" sensitive={true}/>
                    <Button title="Login" onPress={handleSignIn} color="black"/>
                </View>
                {/**CREATE NEW ACCOUNT*/}
                <View className="gap-y-6">
                    <Text className="text-center text-xl">Don't have an account? </Text>
                    <Button title="Create Account" onPress={()=>navigation.replace('CreateAccount')} color="#E63946"/>
                </View>
            </View>
        </View>
    );
}

export default SignIn;