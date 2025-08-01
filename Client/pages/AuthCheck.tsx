import { useNavigation } from "@react-navigation/native";
import { getCurrentUser } from "aws-amplify/auth";
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";

const AuthCheck=()=>{
    const navigation = useNavigation<any>();
    
    useEffect(() => {
        async function checkUser() {
        try {
            const user = await getCurrentUser();
            if (user) {
            navigation.navigate('HomePage');
            return;
            } 
        } catch {}
        navigation.navigate('Setup');
        }
        checkUser();
    }, [navigation]);
    
    
    return <SafeAreaView><ActivityIndicator/></SafeAreaView>;      
}

export default AuthCheck;