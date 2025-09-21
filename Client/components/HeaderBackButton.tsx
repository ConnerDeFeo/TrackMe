import { Image, TouchableOpacity } from "react-native";
import { useNav } from "../hooks/useNav";

const HeaderBackButton = ({destination}:{destination:string}) => {
    const {goBack, popTo} = useNav(); // Access navigation for goBack
    return (
        <TouchableOpacity onPress={destination ? () => popTo(destination) : goBack}>
            <Image source={require("../assets/images/Back.png")} className="h-8 w-8" />
        </TouchableOpacity>
    );
}
export default HeaderBackButton;