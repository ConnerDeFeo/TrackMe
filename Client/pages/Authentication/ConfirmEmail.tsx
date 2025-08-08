import { confirmSignUp } from "aws-amplify/auth";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserService from "../../services/UserService";
import TrackMeButton from "../../components/TrackMeButton";


//Confirm Email page
const ConfirmEmail = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
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
            navigation.navigate(`${accountType}Groups`);

        } catch (error: any) {
            console.log(error)
            setMessage(error.message);
        }
    }

    return (
        <View className="m-auto gap-y-10 w-[90%]">
            <Text className="text-center text-lg text-red-500">{message}</Text>
            <Text>Confirm Email</Text>
            <Text>Please enter the verification code sent to your email.</Text>
            <TextInput
                placeholder="Verification Code"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setVerificationCode}
            />
            <TrackMeButton title="Confirm" onPress={handleConfirmEmail} />
        </View>
    );
}

export default ConfirmEmail;