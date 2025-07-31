import AuthInput from "../components/AuthInput";
import { Button, Image, Pressable, Text, View } from "react-native";
import { useState } from "react";
import AthleteService from "../services/AthleteService";
import { useNavigation } from "@react-navigation/native";

//Create account page
const SignIn = ()=>{
    const navigation = useNavigation<any>();

    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const handleSignIn = async () => {
    }

    return(
        <View className="m-auto gap-y-10 w-[90%]">
            <AuthInput value={username} setValue={setUsername} placeholder="Username"/>
            <AuthInput value={password} setValue={setPassword} placeholder="Password" sensitive={true}/>
            <Button title="Sign In" onPress={handleSignIn}/>
            <View className="flex flex-row mx-auto">
                <Text className="text-center">Don't have an account? </Text>
                <Pressable onPress={()=>navigation.navigate('CreateAccount')}>
                    <Text className="underline text-blue-500">Create Account</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default SignIn;