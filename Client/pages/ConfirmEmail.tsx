import { confirmSignUp, signIn } from "aws-amplify/auth";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import GlobalStorage from "../services/GlobalStorage";

//Used to transfer username and password from creation screen to this one
type RootStackParamList = {
    ConfirmScreen: {
      password: string;
    };
}
type ConfirmScreenRouteProp = RouteProp<RootStackParamList, 'ConfirmScreen'>;

//Confirm Email page
const ConfirmEmail = () => {
    const route = useRoute<ConfirmScreenRouteProp>();
    const {password} = route.params;
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
            console.log(username)
            console.log(password)
            // await confirmSignUp({
            //     username: username,
            //     confirmationCode: verificationCode
            // });
            //If confirm email is succesfull, immediatlye login and reroute to home page
            const resp = await signIn({
                username:"c.jack.defeo@gmail.com",
                password:password
            })
            console.log(resp);
            navigation.navigate("HomePage");
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