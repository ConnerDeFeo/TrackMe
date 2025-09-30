import { Image, Pressable } from "react-native";

const PlusButton = ({onPress}:{onPress: () => void}) => (
  <Pressable onPress={onPress}>
    <Image source={require("../assets/images/Plus.png")} className="h-6 w-6"/>
  </Pressable>
);

export default PlusButton;
