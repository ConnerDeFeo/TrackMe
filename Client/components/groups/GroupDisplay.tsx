import { Text, TouchableOpacity, View } from "react-native";

//Each individual group display component
const GroupDisplay: React.FC<{ groupName:string, navigateTo: ()=>void }> = ({ groupName, navigateTo }) => {
    return (
        <View className="bg-white rounded-xl w-[95%] mx-auto p-5 my-3 shadow-md border-l-4 border-l-red-500">
            <TouchableOpacity 
            onPress={navigateTo}
            className="active:opacity-70"
            >
            <Text className="text-xl font-semibold text-gray-800 ml-4">
                {groupName}
            </Text>
            </TouchableOpacity>
        </View>
    );
}

export default GroupDisplay;
