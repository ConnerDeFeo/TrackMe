import { Pressable, Text } from "react-native";

/**
 * A customizable text button component for React Native.
 *
 * @remarks
 * Renders a pressable text element with configurable color and action.
 *
 * @param text - The label displayed inside the button.
 * @param onPress - Callback invoked when the button is pressed.
 * @param red - If true, styles the text with the "trackme-red" color; otherwise uses "trackme-blue". Defaults to false.
 *
 * @returns A Pressable wrapping styled Text.
 */
const TextButton = ({text, onPress, red}:{text: string, onPress: () => void, red?: boolean})=>{
    return(
        <Pressable className="px-6 py-3" onPress={onPress}>
            <Text className={`font-medium ${red ? 'trackme-red' : 'trackme-blue'}`}>{text}</Text>
        </Pressable>
    );
}

export default TextButton;