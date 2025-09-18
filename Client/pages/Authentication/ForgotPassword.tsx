import AuthInput from "../../components/authentication/AuthInput";
import { Button, Text, View } from "react-native";
import { useState } from "react";
import { resetPassword } from "aws-amplify/auth";
import AuthenticationHeader from "../../components/authentication/AuthenticationHeader";
import { useNavigation } from "@react-navigation/native";

//Forgot password page
const ForgotPassword = () => {
    const navigation = useNavigation<any>();
    
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleError = (error: any) => {
        setError(error.message);
    };

    //Function to request password reset
    const handleRequestReset = async () => {
        if (!username) {
            setError("Please enter your username or email");
            return;
        }
        try {
            await resetPassword({ username });
            navigation.navigate("Auth", { screen: 'ResetPassword', params: { username } });
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <View className="relative h-full w-[85%] mx-auto">
            <AuthenticationHeader />
            <View className="m-auto gap-y-10 w-full">
                {/**ERROR/SUCCESS MESSAGES*/}
                {error && <Text className="text-red-500 text-center">{error}</Text>}
                {/**RESET PASSWORD FORM*/}
                <View className="gap-y-4 bg-red-200 rounded-xl p-6">
                    <AuthInput 
                        value={username} 
                        setValue={setUsername} 
                        placeholder="Username or Email"
                    />
                    <Button title="Send Reset Code" onPress={handleRequestReset} color="black" />
                </View>

                {/**BACK TO SIGN IN*/}
                <View className="gap-y-6">
                    <Button 
                        title="Back to Sign In" 
                        onPress={() => navigation.navigate("Auth", { screen: 'SignIn' })} 
                        color="#E63946"
                    />
                </View>
            </View>
        </View>
    );
};

export default ForgotPassword;