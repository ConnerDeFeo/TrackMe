import { useNavigation } from "@react-navigation/native";

//Constant navigation hook to be used in place of useNavigation
export const useNav = () =>{
    const navigation = useNavigation<any>();

    const navigate = (screen: string, params?: any) => {
        navigation.navigate("User", { screen, params });
    }

    const replace = (screen: string, params?: any) => {
        navigation.replace("User", { screen, params });
    }
    const popTo = (destination:string) => {
        navigation.popTo(destination);
    }
    const goBack = () => {
        navigation.goBack();
    }

    return {
        navigate,
        replace,
        goBack,
        popTo
    }
}