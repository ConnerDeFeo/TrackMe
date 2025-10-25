import AuthInput from "../../common/components/authentication/AuthInput";
import { Text, Pressable, View } from "react-native";
import { useState } from "react";
import { signUp } from 'aws-amplify/auth';
import AuthenticationHeader from "../../common/components/authentication/AuthenticationHeader";
import { useNavigation } from "@react-navigation/native";
import { AccountType } from "../../common/constants/Enums";
import TrackMeButton from "../../common/components/display/TrackMeButton";

//Create account page
const CreateAccount = ()=>{
    const navigation = useNavigation<any>();

    const [message, setMessage] = useState<string>("");
    const [accountType,setAccountType] = useState<string>(AccountType.Athlete);
    const [username,setUsername] = useState<string>("");
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [confirmPassword,setConfirmPassword] = useState<string>("");
    
    //Handle error messages based on the error type
    const handleError = (error:any) => {
        console.log("Sign up error:", error);
        switch (error.name) {
            case 'UsernameExistsException':
                setMessage("Username already exists. Please choose a different username.");
                break;
            case 'InvalidPasswordException':
                setMessage("Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols.");
                break;
            case 'InvalidParameterException':
                setMessage("Please enter a valid email address.");
                break; 
            default:
                setMessage("Sign up failed. Please try again.");
                break;
        }
    }

    //OnClick of the create account button
    const handleCreateAccount = async () => {
        if(password!==confirmPassword){
            setMessage("Passwords must match");
            return;
        }
        try{
            //Amazon cognito
            const cognitoResp = await signUp({
                username: username,
                password: password,
                options:{
                    userAttributes:{
                        email:email,
                        'custom:accountType': accountType
                    }
                }
            });
            const userId = cognitoResp.userId;
            if (!userId) {
                setMessage("Failed to retrieve user ID. Please try again.");
                return;
            }

            navigation.reset({index: 0,routes: [{ name: "ConfirmEmail", params: { username: username, password: password } }],});
        }
        catch (error:any) {
            handleError(error);
        }
    }

    const handleSignInButtonPress = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
    }

    return(
        <View className="relative h-full w-[85%] mx-auto">
            <AuthenticationHeader />
            <View className="m-auto gap-y-10 w-full">
            {/**ERROR MESSAGE*/}
            <Text className="text-red-500 text-center text-xl">{message}</Text>
            
            {/**CREATE ACCOUNT FORM*/}
            <View className="gap-y-8 bg-blue-200 rounded-xl p-6">
                <View className="rounded-lg h-12 flex flex-row overflow-hidden">
                <Pressable 
                    onPress={() => setAccountType(AccountType.Athlete)} 
                    className={`flex-1 items-center justify-center rounded-lg ${accountType === AccountType.Athlete ? 'bg-black' : 'bg-white border-2 border-gray-400'}`}
                >
                    <Text className={`text-xl ${accountType === AccountType.Athlete ? 'text-white font-bold' : 'text-black'}`}>Athlete</Text>
                </Pressable>
                <Pressable 
                    onPress={() => setAccountType(AccountType.Coach)}
                    className={`flex-1 items-center justify-center rounded-lg ${accountType === AccountType.Coach ? 'bg-black' : 'bg-white border-2 border-gray-400'}`}
                >
                    <Text className={`text-xl ${accountType === AccountType.Coach ? 'text-white font-bold' : 'text-black'}`}>Coach</Text>
                </Pressable>
                </View>
                <AuthInput value={email} setValue={setEmail} placeholder="Email"/>
                <AuthInput value={username} setValue={setUsername} placeholder="Username"/>
                <AuthInput value={password} setValue={setPassword} placeholder="Password" sensitive={true}/>
                <AuthInput value={confirmPassword} setValue={setConfirmPassword} placeholder="Confirm Password" sensitive={true}/>
                <TrackMeButton text="Create Account" onPress={handleCreateAccount} black/>
            </View>

            {/**SIGN IN LINK*/}
            <View className="gap-y-6">
                <Text className="text-center text-xl">Already have an account? </Text>
                <TrackMeButton text="Sign In" onPress={handleSignInButtonPress}/>
            </View>
            </View>
        </View>
    );
}

export default CreateAccount;