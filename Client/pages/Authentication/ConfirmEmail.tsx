import { confirmSignUp, fetchUserAttributes, resendSignUpCode } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import UserService from "../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";


//Confirm Email page
const ConfirmEmail = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const {username, password} = route.params as { username: string; password: string; };

    const [verificationCode, setVerificationCode] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [resendCodeTimer, setResendCodeTimer] = useState<number>(0);

    // Whenever code is resent, start a 60 second timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCodeTimer > 0) {
            timer = setTimeout(() => setResendCodeTimer(resendCodeTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCodeTimer]);

    //On click of the confirm button
    const handleConfirmEmail = async () => {
        try {
            await confirmSignUp({
                username: username,
                confirmationCode: verificationCode
            });
            //If confirm email is succesfull, immediatley login and reroute to home page
            await UserService.signIn(username, password);
            const attribute = await fetchUserAttributes();
            const accountType = attribute['custom:accountType'];
            navigation.replace("User", { screen: `${accountType}Groups` });

        } catch (error: any) {
            setMessage(error.message);
        }
    }

    const handleResendCode = async () => {
        if (resendCodeTimer > 0) {
            return;
        }
        try {
            await resendSignUpCode({username:username});
            setResendCodeTimer(60);
            setMessage("Verification code resent. Please check your email.");
        } catch (error: any) {
            setMessage(error.message);
        }
    }

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
            {message ? (
                <View className="bg-red-50 border border-red-200 rounded-lg p-3 m-3">
                    <Text className="text-red-600 text-center">{message}</Text>
                </View>
            ) : null}
            <View className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 gap-y-6">
                <View className="items-center space-y-2">
                    <Text className="text-2xl font-bold text-gray-800">Confirm Email</Text>
                    <Text className="text-gray-600 text-center">
                    Enter the verification code sent to your email.
                    </Text>
                </View>
                
                <View className="gap-y-4">
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                        placeholder="verification code"
                        keyboardType="numeric"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        textAlign="center"
                        maxLength={6}
                    />
                    
                    <View className="gap-y-3">
                        <Button title="Confirm Email" color="#E63946" onPress={handleConfirmEmail} />
                        <Button title="Back to Sign In" color="black" onPress={() => navigation.replace("Auth", { screen: 'SignIn' })} />
                        <View className="flex flex-row justify-between items-center">
                            <TouchableOpacity onPress={handleResendCode} disabled={resendCodeTimer > 0}>
                                <Text className="underline">Resend Code</Text>
                            </TouchableOpacity>
                            {resendCodeTimer > 0 &&
                                <View className=" px-3 py-1">
                                    <Text className="text-gray-600">Resend in {resendCodeTimer}s</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default ConfirmEmail;