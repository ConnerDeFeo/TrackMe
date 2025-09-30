import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Platform } from "react-native";

const ArrowButton = ({onPress, className, direction = "right"}:{onPress: () => void, className?: string, direction?: "right" | "left"})=>{
    const name = Platform.OS === 'ios' ? "chevron-" : "arrow-";
    const color = Platform.OS === 'ios' ? "#007AFF" : "#000";
    return(
        <Pressable onPress={onPress} className={className}>
            <Ionicons name={direction === "right" ? `${name}forward` : `${name}back`} size={24} color={color} /> 
        </Pressable>
    );
}

export default ArrowButton;