import { confirmSignUp } from "aws-amplify/auth";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import GlobalStorage from "../services/GlobalStorage";
import { useNavigation } from "@react-navigation/native";

//Confirm Email page
const ConfirmEmail = () => {
    const navigation = useNavigation<any>();

    const [verificationCode, setVerificationCode] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    //On click of the confirm button
    const handleConfirmEmail = async () => {
        const username = await GlobalStorage.getItem("username");
        if (!username) {
            setMessage("No username found. Please create an account first.");
            return;
        }
        try {
            const resp = await confirmSignUp({
                username: username,
                confirmationCode: verificationCode
            });
            console.log(resp);
            navigation.navigate("HomePage");
        } catch (error: any) {
            setMessage(error.message);
        }
    }

    return (
        <View className="m-auto gap-y-10 w-[90%]">
            <Text className="text-3xl text-red-500 text-center">{message}</Text>
            <Text>Confirm Email</Text>
            <Text>Please enter the verification code sent to your email.</Text>
            <TextInput
                placeholder="Verification Code"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setVerificationCode}
            />
            <Button title="Confirm" onPress={handleConfirmEmail} />
        </View>
    );
}

export default ConfirmEmail;