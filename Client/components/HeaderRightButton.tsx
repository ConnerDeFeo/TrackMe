import { Image, Pressable } from "react-native";

const images = {
  plus: require("../assets/images/Plus.png"),
  settings: require("../assets/images/Settings.png"),
}
const HeaderRightButton = ({onPress, image}:{onPress: () => void, image: "plus" | "settings"}) => (
  <Pressable onPress={onPress} className="py-2 px-4">
    <Image source={images[image]} className="h-6 w-6"/>
  </Pressable>
);

export default HeaderRightButton;
