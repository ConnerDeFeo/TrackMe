import AuthInput from "../components/AuthInput";
import { Button, Pressable, Text, View } from "react-native";
import { useState } from "react";
import AthleteService from "../services/AthleteService";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

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

    const validateCredentials = ():boolean => {
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return false;
        }
        else if (password.length < 8){
            setMessage("Password must be at least 8 characters long");
            return false;
        }
        else if (username.length < 5){
            setMessage("Username must be at least 5 characters long");
            return false;
        }
        else if (email.length < 5){
            setMessage("Email must be at least 5 characters long");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Invalid email format");
            return false;
        }
        return true;
    }

    //OnClickl of the create account button
    const handleCreateAccount = async () => {
        if (!validateCredentials()) {
            return;
        }
        const resp = await AthleteService.createAthlete({
            'username': username,
            'first_name': "test username",
            'last_name': "test last name",
            'email': email,
            'password': password
        });
        if(resp.status == 200){
            return;
        }
        setMessage("Username or email already exists.");
    }

    return(
        <View className="m-auto gap-y-10 w-[90%]">
            <Text className="text-3xl text-red-500">{message}</Text>
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