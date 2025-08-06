import { useNavigation } from "@react-navigation/native";
import { fetchUserAttributes, getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";

const AuthCheck=()=>{
    const navigation = useNavigation<any>();
    
    useEffect(() => {
        async function checkUser() {
        try {
            const userAttributes = await fetchUserAttributes();
            if (userAttributes) {
                const accountType = userAttributes['custom:accountType'];
                navigation.navigate(`${accountType}HomePage`);
                return;
            } 
        } catch(Exception) {
            navigation.navigate('Setup');
        }
        }
        checkUser();
    }, [navigation]);
    
    
    return <SafeAreaView><ActivityIndicator/></SafeAreaView>;      
}

export default AuthCheck;