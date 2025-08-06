import { confirmSignUp, signIn } from "aws-amplify/auth";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import UserService from "../../services/UserService";
import AsyncStorage from "../../services/AsyncStorage";

//Used to transfer username and password from creation screen to this one
type RootStackParamList = {
    ConfirmScreen: {
        username: string;
        password: string;
    };
}
type ConfirmScreenRouteProp = RouteProp<RootStackParamList, 'ConfirmScreen'>;

//Confirm Email page
const ConfirmEmail = () => {
    const route = useRoute<ConfirmScreenRouteProp>();
    const {username, password} = route.params;
    const navigation = useNavigation<any>();

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
            await signIn({
                username:username,
                password:password
            })
            const accountType = await UserService.getAccountType();
            AsyncStorage.storeData('accountType', accountType!);
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
            <Button title="Confirm" onPress={handleConfirmEmail} />
        </View>
    );
}

export default ConfirmEmail;