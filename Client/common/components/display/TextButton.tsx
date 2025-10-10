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
 * @param className - Additional tailwind classes to apply.
 *
 * @returns A Pressable wrapping styled Text.
 */
const TextButton = ({
    text,
    onPress,
    red,
    className,
}: {
    text: string
    onPress: () => void
    red?: boolean
    className?: string
}) => {
    return (
        <Pressable
            className={`flex-row items-center ${className || ""}`}
            onPress={onPress}
        >
            <Text
                className={`text-center font-medium px-6 py-2 ${
                    red ? "trackme-red" : "trackme-blue"
                }`}
            >
                {text}
            </Text>
        </Pressable>
    )
}

export default TextButton