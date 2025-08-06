import AuthInput from "../../components/AuthInput";
import { Button, Pressable, Text, View } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { signUp } from 'aws-amplify/auth';
import AthleteService from "../../services/AthleteService";
import CoachService from "../../services/CoachService";

//type used to grab username and password that were given along the route

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
        console.error("Sign up error:", error);
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
                rdsResp = await AthleteService.createAthlete({
                    username: username,
                    userId: userId
                });
            else
                rdsResp = await CoachService.createCoach({
                    username: username,
                    userId: userId
                });
            if(!rdsResp) {
                setMessage("Failed to create account. Please try again.");
                return;
            }

            navigation.navigate('ConfirmEmail',{username:username,password:password})
        }
        catch (error:any) {
            handleError(error);
        }
    }

    return(
        <View className="m-auto gap-y-10 w-[90%]">
            <Text className="text-3xl text-red-500 text-center">{message}</Text>
            <Picker
                selectedValue={accountType}
                onValueChange={itemValue => setAccountType(itemValue)}
            >
                <Picker.Item label="Athlete" value="athlete" style = {selectStyling}/>
                <Picker.Item label="Coach" value="coach" style = {selectStyling}/>
            </Picker>
            <AuthInput value={email} setValue={setEmail} placeholder="Email"/>
            <AuthInput value={username} setValue={setUsername} placeholder="Username"/>
            <AuthInput value={password} setValue={setPassword} placeholder="Password" sensitive={true}/>
            <AuthInput value={confirmPassword} setValue={setConfirmPassword} placeholder="Confirm Password" sensitive={true}/>
            <Button title="Create Account" onPress={handleCreateAccount}/>
            <View className="flex flex-row mx-auto">
                <Text className="text-center">Already have an account? </Text>
                <Pressable onPress={()=>navigation.navigate('SignIn')}>
                    <Text className="underline text-blue-500">Sign In</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default CreateAccount;