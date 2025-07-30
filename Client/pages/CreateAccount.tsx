import AuthInput from "../components/AuthInput";
import { Button, View } from "react-native";
import { useState } from "react";
import AthleteService from "../services/AthleteService";

//Create account page
const CreateAccount = ()=>{
    const [username,setUsername] = useState<string>("");
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [confirmPassword,setConfirmPassword] = useState<string>("");

    const handleCreateAccount = async () => {
        await AthleteService.createAthlete({
            'username': username,
            'first_name': "test username",
            'last_name': "test last name",
            'email': email,
            'password': password
        });
    }

    return(
        <View className="m-auto gap-y-10 w-[90%]">
            <AuthInput value={email} setValue={setEmail} placeholder="Email"/>
            <AuthInput value={username} setValue={setUsername} placeholder="Username"/>
            <AuthInput value={password} setValue={setPassword} placeholder="Password"/>
            <AuthInput value={confirmPassword} setValue={setConfirmPassword} placeholder="Confirm Password"/>
            <Button title="Create Account" onPress={handleCreateAccount} />
        </View>
    );
}

export default CreateAccount;