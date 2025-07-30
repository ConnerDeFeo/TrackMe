import AuthInput from "../components/AuthInput";
import { View } from "react-native";
import { useState } from "react";

//Create account page
const CreateAccount = ()=>{
    const [username,setUsername] = useState<string>("");
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [confirmPassword,setConfirmPassword] = useState<string>("");

    

    return(
        <View className="m-auto gap-y-10 w-[90%]">
            <AuthInput value={email} setValue={setEmail} placeholder="Email"/>
            <AuthInput value={username} setValue={setUsername} placeholder="Username"/>
            <AuthInput value={password} setValue={setPassword} placeholder="Password"/>
            <AuthInput value={confirmPassword} setValue={setConfirmPassword} placeholder="Confirm Password"/>
        </View>
    );
}

export default CreateAccount;