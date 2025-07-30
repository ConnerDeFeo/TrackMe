import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

const Setup = ()=>{
    const textStyling = "text-3xl text-center";
    const navigation = useNavigation<any>();

    return(
        <View className="m-auto text-4xl gap-y-10">
            <Text className="text-center text-8xl">Track Me</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                <Text className={textStyling}>Create Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text className={textStyling}>Sign In</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Setup;