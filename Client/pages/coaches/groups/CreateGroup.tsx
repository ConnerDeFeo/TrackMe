import { useEffect, useState } from "react";
import { Button, TextInput, View } from "react-native";
import AsyncStorage from "../../../services/AsyncStorage";
import CoachGroupService from "../../../services/CoachGroupService";
import { useNav } from "../../../hooks/useNav";


//Page where coaches can create a new group
const CreateGroup = () => {
    const { replace } = useNav();
    //State to hold group name and user ID
    const [groupName, setGroupName] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        // Fetch user ID from local storage or authentication context
        const fetchUserId = async () => {
            const id = await AsyncStorage.getData("userId");
            if (id){
                setUserId(id);
            } 
        };
        fetchUserId();
    }, []);

    //handles groups creation and redirection
    const handleCreateGroup = async () => {
        try {
            const resp = await CoachGroupService.createGroup(userId, groupName);
            if(resp.ok){
                const data = await resp.json();
                replace('ViewGroupCoach', { groupId: data.groupId, groupName: groupName });
            }
        } catch (error) {
            console.log("Error creating group:", error);
        }
    };

    return (
        <View className="flex-1 justify-center items-center px-6 bg-gray-50 mt-[4rem]">
            <View className="w-full max-w-sm space-y-4">
            <TextInput
                placeholder="Enter Group Name"
                value={groupName}
                onChangeText={setGroupName}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 shadow-sm"
            />
            <View className="mt-6">
                <Button 
                title="Create Group" 
                onPress={handleCreateGroup}
                color="#E63946"
                />
            </View>
            </View>
        </View>
    );
};

export default CreateGroup;