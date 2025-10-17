import { Image, Pressable } from "react-native";

const images = {
  plus: require("../../assets/images/Plus.png"),
  settings: require("../../assets/images/Settings.png"),
  clipboard: require("../../assets/images/Clipboard.png"),
}
const HeaderRightButton = ({onPress, image}:{onPress: () => void, image: "plus" | "settings" | "clipboard"}) => (
  <Pressable onPress={onPress} className="pt-2 px-4 pb-1">
    <Image source={images[image]} className="h-7 w-7"/>
  </Pressable>
);

export default HeaderRightButton;
