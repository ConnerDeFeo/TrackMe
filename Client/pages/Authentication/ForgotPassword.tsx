import AuthInput from "../../components/authentication/AuthInput";
import { Text, TouchableOpacity, View } from "react-native";
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
                    <TouchableOpacity 
                        onPress={handleRequestReset} 
                        className="bg-black py-3 rounded"
                    >
                        <Text className="text-white text-center font-medium">Send Reset Code</Text>
                    </TouchableOpacity>
                </View>

                {/**BACK TO SIGN IN*/}
                <View className="gap-y-6">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("Auth", { screen: 'SignIn' })} 
                        className="py-3 rounded"
                        style={{ backgroundColor: "#E63946" }}
                    >
                        <Text className="text-white text-center font-medium">Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ForgotPassword;