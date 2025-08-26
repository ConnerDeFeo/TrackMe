import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import GeneralService from "../../services/GeneralService";
import UserService from "../../services/UserService";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";

//Create workout group for a given group
const CreateWorkoutGroup = ()=>{
    const navigation = useNavigation<any>();
    const route = useRoute();
    const {groupId} = route.params as {groupId: string};
    const [workoutGroupName, setWorkoutGroupName] = useState<string>("");
    const [groupMembers, setGroupMembers] = useState<string[]>([]);
    const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

    useEffect(()=>{
        const fetchGroupAthletes = async ()=>{
            const resp = await GeneralService.getAthletesForGroup(groupId);
            const userId = await UserService.getUserId();
            if (resp.ok && userId) {
                const data = await resp.json();
                setSelectedAthletes([userId]);
                setGroupMembers(data);
            }
        }
        fetchGroupAthletes();
    },[]);

    const onGroupCreation = async ()=>{
        const date = new Date().toISOString().split('T')[0];
        const resp = await AthleteWorkoutService.createWorkoutGroup(selectedAthletes, groupId, date, workoutGroupName);
        if (resp.ok) {
            navigation.goBack();
        } 
    }

    return (
        <View className="mt-[4rem]">
            <Text>Create Workout Group</Text>
            <TextInput
                placeholder="Workout Group Name"
                value={workoutGroupName}
                onChangeText={setWorkoutGroupName}
                className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
            />
            {
            groupMembers.map((athlete, index)=>{
                return (
                    <View key={index} className="flex flex-row justify-between items-center">
                        <Text>{athlete[1]}</Text>
                        <TouchableOpacity onPress={() => {
                            setSelectedAthletes(prev => {
                                if (prev.includes(athlete[0])) {
                                    return prev.filter(id => id !== athlete[0]);
                                } else {
                                    return [...prev, athlete[0]];
                                }
                            });
                        }}>
                            <Text>{selectedAthletes.includes(athlete[0]) ? "Deselect" : "Select"}</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
            <Button title="Create Group" onPress={onGroupCreation} />
        </View>
    )
}

export default CreateWorkoutGroup;