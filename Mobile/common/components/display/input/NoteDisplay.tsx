import { Text, View } from "react-native";

const NoteDisplay = ({note, selected}:{note:string, selected?: boolean}) => {
    return (
        <View className={`p-2 rounded-lg trackme-bg-gray border ${selected ? "border-red-500" : "border-transparent"}`}>
            <Text className="font-semibold italic border-l-2 trackme-border-blue pl-2">{note}</Text>
        </View>
    );
}
export default NoteDisplay;