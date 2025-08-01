import AuthInput from "../components/AuthInput";
import { Button, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { fetchAuthSession, getCurrentUser, signIn } from "aws-amplify/auth";

//Create account page
const SignIn = ()=>{
    const navigation = useNavigation<any>();

    const [username,setUsername] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [error,setError] = useState<string>("");

    //Function to handle sign in
    const handleSignIn = async () => {
        try{
            const resp = await signIn({
                username: username,
                password: password
            });
            console.log(resp);
            navigation.navigate('HomePage');
        }catch (error:any) {
            setError(error.message);
            console.log('=== ERROR DETAILS ===');
            console.log('Error object:', error);
            console.log('Error name:', error.name);
            console.log('Error message:', error.message);
            console.log('Error stack:', error.stack);
            console.log('Error code:', error.code);
            console.log('Full error JSON:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
            console.log('=== END ERROR DETAILS ===');
        }
    }

    return(
        <View className="m-auto gap-y-10 w-[90%]">
            <Text className="text-red-500 text-center">{error}</Text>
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