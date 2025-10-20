import { Pressable, Text, View } from "react-native";

const RenderDay = ({ day, available, onPress }: { day: number | null; available: boolean; onPress?: () => void }) => {
    return (
        <Pressable
            className={`w-[14.28%] aspect-square border trackme-border-gray rounded-full items-center justify-center 
            ${available ? "trackme-bg-blue" : ""}`}
            onPress={available ? onPress : undefined}
        >
            {day && <Text className={`my-auto ${available ? "text-white" : ""}`}>{day}</Text>}
        </Pressable>
    );
}

export default RenderDay;