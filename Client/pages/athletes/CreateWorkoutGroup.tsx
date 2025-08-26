import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

//Create workout group for a given group
const CreateWorkoutGroup = ()=>{
    const route = useRoute();
    const [groupName, setGroupName] = useState<string>("");
    const [groupMembers, setGroupMembers] = useState<string[]>([]);

    useEffect(()=>{
        
    },[]);
    return (
        <View className="mt-[4rem]">
            <Text>Create Workout Group</Text>
            <TextInput
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
                className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
            />
        </View>
    )
}

export default CreateWorkoutGroup;