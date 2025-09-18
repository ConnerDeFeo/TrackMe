import AuthInput from "../../components/AuthInput";
import { Button, Text, View } from "react-native";
import { useState } from "react";
import { confirmResetPassword } from "aws-amplify/auth";
import AuthenticationHeader from "../../components/AuthenticationHeader";
import { useNavigation, useRoute } from "@react-navigation/native";

//Reset password page
const ResetPassword = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { username } = (route.params as { username: string }) || {};

    const [confirmationCode, setConfirmationCode] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleError = (error: any) => {
        setError(error.message);
    };

    //Function to confirm password reset
    const handleConfirmReset = async () => {
        if (!confirmationCode || !newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            await confirmResetPassword({
                username: username,
                confirmationCode,
                newPassword
            });
            navigation.replace("Auth", { screen: 'SignIn', params: { resetPasswordMessage:"Password reset successful" } });
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <View className="h-full w-[85%] mx-auto relative">
            <AuthenticationHeader />
            <View className="m-auto gap-y-10 w-full">
            {/**ERROR/SUCCESS MESSAGES*/}
            {error && <Text className="text-red-500 text-center absolute -top-8 left-0 right-0">{error}</Text>}

            {/**RESET PASSWORD FORM*/}
            <View className="gap-y-4 bg-red-200 rounded-xl p-6">
                <Text className="text-center text-gray-700 mb-4">
                Enter the code sent to your email
                </Text>
                <AuthInput 
                value={confirmationCode} 
                setValue={setConfirmationCode} 
                placeholder="Confirmation Code"
                />
                <AuthInput 
                value={newPassword} 
                setValue={setNewPassword} 
                placeholder="New Password" 
                sensitive={true}
                />
                <AuthInput 
                value={confirmPassword} 
                setValue={setConfirmPassword} 
                placeholder="Confirm New Password" 
                sensitive={true}
                />
                <Button title="Reset Password" onPress={handleConfirmReset} color="black" />
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

export default ResetPassword;
