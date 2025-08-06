import { useNavigation } from "@react-navigation/native";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";

const AuthCheck=()=>{
    const navigation = useNavigation<any>();
    
    useEffect(() => {
        async function checkUser() {
        try {
            const user = await getCurrentUser();
            console.log("Current user:", user);
            
            // Uncomment the line below to force logout for testing
            await signOut();
            
            if (user) {
                navigation.navigate('HomePage');
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