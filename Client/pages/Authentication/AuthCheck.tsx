import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import UserService from "../../services/UserService";

//Check to see if user is already logged in, then redirect accordingly
const AuthCheck=()=>{
    const navigation = useNavigation<any>();
    
    useEffect(() => {
        async function checkUser() {
        try {
            const accountType =await UserService.getAccountType();
            if (accountType) {
                AsyncStorage.setItem('accountType', accountType);
                navigation.navigate(`${accountType}Groups`);
                return;
            } 
        } catch(Exception) {
            console.error("Error fetching user attributes:", Exception);
            navigation.navigate('Setup');
        }
        }
        checkUser();
    }, [navigation]);
    
    
    return <SafeAreaView><ActivityIndicator/></SafeAreaView>;      
}

export default AuthCheck;