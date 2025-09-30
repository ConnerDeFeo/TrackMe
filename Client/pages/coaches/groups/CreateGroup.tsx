import { useState } from "react";
import { Text, TextInput, Pressable, View } from "react-native";
import CoachGroupService from "../../../services/CoachGroupService";
import { useNavigation } from "@react-navigation/native";


//Page where coaches can create a new group
const CreateGroup = () => {
    const navigation = useNavigation<any>();
    const [groupName, setGroupName] = useState("");

    //handles groups creation and redirection
    const handleCreateGroup = async () => {
        try {
            const resp = await CoachGroupService.createGroup(groupName);
            if(resp.ok){
                const data = await resp.json();
                navigation.navigate('ViewGroupCoach', { groupId: data.groupId, groupName: groupName });
            }
        } catch (error) {
            console.log("Error creating group:", error);
        }
    };

    const handleGroupNameChange = (text: string) => {
        if (text.length <= 30) { // Limit to 30 characters
            setGroupName(text);
        }
    }

    return (
        <View className="flex-1 justify-center items-center px-6 bg-gray-50 mt-4">
            <View className="w-full max-w-sm gap-y-4">
            <TextInput
                placeholder="Enter Group Name"
                value={groupName}
                onChangeText={handleGroupNameChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 shadow-sm"
            />
            <View className="mt-6">
                <Pressable
                    onPress={handleCreateGroup}
                    className="bg-red-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white text-center font-semibold">
                        Create Group
                    </Text>
                </Pressable>
            </View>
            </View>
        </View>
    );
};

export default CreateGroup;