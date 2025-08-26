import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import GeneralService from "../../services/GeneralService";

//Create workout group for a given group
const CreateWorkoutGroup = ()=>{
    const route = useRoute();
    const {groupId} = route.params as {groupId: string};
    const [groupName, setGroupName] = useState<string>("");
    const [groupMembers, setGroupMembers] = useState<string[]>([]);

    useEffect(()=>{
        const fetchGroupAthletes = async ()=>{
            const resp = await GeneralService.getAthletesForGroup(groupId);
            if (resp.ok) {
                const data = await resp.json();
                setGroupMembers(data);
            }
            else{
                setGroupMembers([]);
            }
        }
        fetchGroupAthletes();
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
            {groupMembers.map((member, index)=>(<Text key={index}>{member}</Text>))}
        </View>
    )
}

export default CreateWorkoutGroup;