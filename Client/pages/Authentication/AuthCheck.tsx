import { useNavigation } from "@react-navigation/native";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";

//Check to see if user is already logged in, then redirect accordingly
const AuthCheck=()=>{
    const navigation = useNavigation<any>();
    
    useEffect(() => {
        async function checkUser() {
        try {
            const userAttributes = await fetchUserAttributes();
            if (userAttributes) {
                const accountType = userAttributes['custom:accountType'];
                navigation.navigate(`${accountType}Groups`);
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