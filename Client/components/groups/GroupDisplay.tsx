import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

//Each individual group display component
const GroupDisplay: React.FC<{ groupName:string, navigateTo: ()=>void }> = ({ groupName, navigateTo }) => {
    return (
        <View className="border p-4 my-2">
            <TouchableOpacity onPress={navigateTo}>
                <Text className="text-lg font-bold">{groupName}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default GroupDisplay;
