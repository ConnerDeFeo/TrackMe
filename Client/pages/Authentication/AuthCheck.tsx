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
            const accountType =await UserService.getAccountType();
            const userId = await UserService.getUserId();
            if (accountType) {
                AsyncStorage.setItem('accountType', accountType);
                AsyncStorage.setItem('userId', userId!);
                navigation.navigate(`${accountType}Groups`);
                return;
            }
            navigation.navigate('Setup');
            
        }
        checkUser();
    }, [navigation]);
    
    
    return <SafeAreaView><ActivityIndicator/></SafeAreaView>;      
}

export default AuthCheck;