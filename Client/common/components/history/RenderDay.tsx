import { Pressable, Text, View } from "react-native";

const RenderDay = ({ day, available, onPress }: { day: number | null; available: boolean; onPress?: () => void }) => {
    return (
        <Pressable
            className={`w-[14.28%] aspect-square border trackme-border-gray rounded-full items-center justify-center 
            ${available ? "bg-blue-100" : ""}`}
            onPress={onPress}
        >
            {day && <Text className="my-auto">{day}</Text>}
        </Pressable>
    );
}

export default RenderDay;