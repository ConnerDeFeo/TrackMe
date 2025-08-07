import { Text, View } from "react-native";

const GroupDisplay: React.FC<{ groupName:string }> = ({ groupName}) => {
    return (
        <View className="border p-4 my-2">
            <Text>{groupName}</Text>
        </View>
    );
}

export default GroupDisplay;
