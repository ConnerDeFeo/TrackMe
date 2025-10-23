import { Pressable, Text } from "react-native";

const RenderDay = ({ day, onPress, hasHistoricalData, inFuture }: { day: number | null; onPress?: () => void; hasHistoricalData: boolean; inFuture?: boolean }) => {
    return (
        <Pressable
            className={`w-[14.28%] aspect-square border trackme-border-gray rounded-full items-center justify-center 
            ${hasHistoricalData ? "trackme-bg-blue" : inFuture ? "trackme-bg-gray" : ""}`}
            onPress={!inFuture ? onPress : undefined}
        >
            {day && <Text className={`my-auto ${hasHistoricalData ? "text-white" : ""}`}>{day}</Text>}
        </Pressable>
    );
}

export default RenderDay;