import { useNavigation } from "@react-navigation/native";
import { Image, TouchableOpacity } from "react-native";

const HeaderBackButton = ({destination}:{destination:string}) => {
    const navigation = useNavigation<any>();
    return (
        <TouchableOpacity onPress={destination ? () => navigation.popTo(destination) : navigation.goBack}>
            <Image source={require("../assets/images/Back.png")} className="h-8 w-8" />
        </TouchableOpacity>
    );
}
export default HeaderBackButton;