import { Pressable, Text } from "react-native";

const TrackMeButton = ({text, onPress, red, gray, className}: {text: string, onPress: () => void, red?: boolean, gray?: boolean, className?: string}) => {
  return (
    <Pressable onPress={onPress} className={`rounded-lg py-2 px-4 ${red ? 'trackme-bg-red' : gray ? 'trackme-bg-gray' : 'trackme-bg-blue'} ${className}`}>
        <Text className={`text-center font-medium ${gray ? 'text-gray-800' : 'text-white'}`}>{text}</Text>
    </Pressable>
  );
}

export default TrackMeButton;