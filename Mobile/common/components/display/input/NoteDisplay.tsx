import { Text, View } from "react-native";

const NoteDisplay = ({note, selected}:{note:string, selected?: boolean}) => {
    return (
        <View className={`p-2 rounded-lg border bg-gray-200 ${selected ? "border-red-500" : "border-transparent"}`}>
            <Text className="font-semibold italic">"{note}"</Text>
        </View>
    );
}
export default NoteDisplay;