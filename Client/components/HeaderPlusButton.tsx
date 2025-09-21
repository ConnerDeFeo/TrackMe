import { Image, TouchableOpacity } from "react-native";

const PlusButton = ({onPress}:{onPress: () => void}) => (
  <TouchableOpacity onPress={onPress}>
    <Image source={require("../assets/images/Plus.png")} className="h-6 w-6"/>
  </TouchableOpacity>
);

export default PlusButton;
