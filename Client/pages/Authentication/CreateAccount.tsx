import AuthInput from "../../components/AuthInput";
import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { signUp } from 'aws-amplify/auth';
import AthleteService from "../../services/AthleteService";
import CoachService from "../../services/CoachService";
import TrackMeButton from "../../components/TrackMeButton";
import AuthenticationHeader from "../../components/AuthenticationHeader";

//Create account page
const CreateAccount = ()=>{
    const navigation = useNavigation<any>();
    const selectStyling = {fontSize:20}

    const [message, setMessage] = useState<string>("");
    const [accountType,setAccountType] = useState<string>("Athlete");
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
            //Create the account in the database
            let rdsResp;
            if(accountType === "Athlete") 
                rdsResp = await AthleteService.createAthlete(userId, username);
            else
                rdsResp = await CoachService.createCoach(userId, username);
            if(!rdsResp) {
                setMessage("Failed to create account. Please try again.");
                return;
            }

            navigation.navigate('ConfirmEmail',{username:username,password:password, accountType:accountType});
        }
        catch (error:any) {
            handleError(error);
        }
    }

    return(
        <View className="relative h-full">
            <AuthenticationHeader />
            <View className="m-auto gap-y-10 w-[90%]">
                {/**ERROR MESSAGE*/}
                <Text className="text-red-500 text-center text-xl">{message}</Text>
                
                {/**CREATE ACCOUNT FORM*/}
                <View className="gap-y-8 bg-red-200 rounded-xl p-6">
                    <View className="bg-white rounded-lg p-2 h-12 justify-center">
                        <Picker
                            selectedValue={accountType}
                            onValueChange={itemValue => setAccountType(itemValue)}
                        >
                            <Picker.Item label="Athlete" value="Athlete" style={selectStyling}/>
                            <Picker.Item label="Coach" value="Coach" style={selectStyling}/>
                        </Picker>
                    </View>
                    <AuthInput value={email} setValue={setEmail} placeholder="Email"/>
                    <AuthInput value={username} setValue={setUsername} placeholder="Username"/>
                    <AuthInput value={password} setValue={setPassword} placeholder="Password" sensitive={true}/>
                    <AuthInput value={confirmPassword} setValue={setConfirmPassword} placeholder="Confirm Password" sensitive={true}/>
                    <TrackMeButton title="Create Account" onPress={handleCreateAccount} color="black"/>
                </View>

                {/**SIGN IN LINK*/}
                <View className="gap-y-6">
                    <Text className="text-center text-xl">Already have an account? </Text>
                    <TrackMeButton title="Sign In" onPress={()=>navigation.navigate('SignIn')} color="#E63946"/>
                </View>
            </View>
        </View>
    );
}

export default CreateAccount;