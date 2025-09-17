import { confirmSignUp } from "aws-amplify/auth";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import UserService from "../../services/UserService";
import { useNav } from "../../hooks/useNav";
import { useRoute } from "@react-navigation/native";


//Confirm Email page
const ConfirmEmail = () => {
    const route = useRoute();
    const {replace, goBack} = useNav();
    const {username, password, accountType} = route.params as { username: string; password: string; accountType: string };

    const [verificationCode, setVerificationCode] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    //On click of the confirm button
    const handleConfirmEmail = async () => {
        try {
            await confirmSignUp({
                username: username,
                confirmationCode: verificationCode
            });
            //If confirm email is succesfull, immediatley login and reroute to home page
            await UserService.signIn(username, password);
            replace(`${accountType}Groups`);

        } catch (error: any) {
            setMessage(error.message);
        }
    }

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
            <View className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 gap-y-6">
                <View className="items-center space-y-2">
                    <Text className="text-2xl font-bold text-gray-800">Confirm Email</Text>
                    <Text className="text-gray-600 text-center">
                    Please enter the verification code sent to your email.
                    </Text>
                </View>
                
                {message ? (
                    <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <Text className="text-red-600 text-center">{message}</Text>
                    </View>
                ) : null}
                
                <View className="gap-y-4">
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                        placeholder="Enter verification code"
                        keyboardType="numeric"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        textAlign="center"
                        maxLength={6}
                    />
                    
                    <View className="gap-y-3">
                        <Button title="Confirm Email" color="#E63946" onPress={handleConfirmEmail} />
                        <Button 
                            title="Back to Create Account" 
                            onPress={() => goBack()}
                            color="black"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default ConfirmEmail;