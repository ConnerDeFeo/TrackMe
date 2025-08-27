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
        <View className="mt-16 px-6 bg-white min-h-screen">
            <Text className="text-3xl font-bold text-black mb-8 text-center">Create Workout Group</Text>
            
            <TextInput
                placeholder="Workout Group Name"
                value={workoutGroupName}
                onChangeText={setWorkoutGroupName}
                className="border-2 border-gray-200 rounded-xl p-4 mb-6 text-black bg-white shadow-sm"
                placeholderTextColor="#666"
            />
            
            <Text className="text-xl font-semibold text-black mb-4">Select Athletes</Text>
            
            <View className="mb-8">
                {groupMembers.map((athlete, index) => {
                    const isSelected = selectedAthletes.includes(athlete[0]);
                    return (
                        <View key={athlete[0]} className="flex flex-row justify-between items-center bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
                            <Text className="text-lg text-black font-medium">{athlete[1]}</Text>
                            <TouchableOpacity 
                                onPress={() => {
                                    setSelectedAthletes(prev => {
                                        if (prev.includes(athlete[0])) {
                                            return prev.filter(id => id !== athlete[0]);
                                        } else {
                                            return [...prev, athlete[0]];
                                        }
                                    });
                                }}
                                className={`px-6 py-2 rounded-lg ${isSelected ? 'bg-gray-200' : 'bg-red-500'}`}
                                style={{backgroundColor: isSelected ? '#f3f4f6' : '#E63946'}}
                            >
                                <Text className={`font-semibold ${isSelected ? 'text-black' : 'text-white'}`}>
                                    {isSelected ? "Deselect" : "Select"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
            
            <TouchableOpacity 
                onPress={onGroupCreation}
                className="p-4 rounded-xl shadow-lg"
                style={{backgroundColor: '#E63946'}}
            >
                <Text className="text-white text-xl font-bold text-center">Create Group</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CreateWorkoutGroup;