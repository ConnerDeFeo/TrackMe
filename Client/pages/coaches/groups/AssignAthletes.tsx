import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import CoachGroupService from "../../../services/CoachGroupService";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserService from "../../../services/UserService";

//Page where coaches can add any current athletes to a given group
const AssignAthletes = ()=>{
    const [athletes, setAthletes] = useState<string[]>([]);
    const route = useRoute();
    const { groupId, fetchParticipants } = route.params as { groupId: string, fetchParticipants: () => void };
    const navigation = useNavigation<any>();
    

    const fetchAbsentAthletes = async () => {
            const userId = await UserService.getUserId();
            const response = await CoachGroupService.getAbsentGroupAthletes(groupId, userId!);
            if (response.ok) {
                const data = await response.json();
                setAthletes(data);
            }
        }

    //Fetch all athletes on load
    useEffect(()=>{
        fetchAbsentAthletes();
    }, []);

    //Handle assigning athletes to given groups
    async function handleAssignAthlete(athleteId: string){
        const userId = await UserService.getUserId();
        const response = await CoachGroupService.add_athlete_to_group(athleteId, groupId, userId!);
        if (response.ok) {
            fetchAbsentAthletes();
            fetchParticipants(); //used to reload previous page
        }
    };

    return (
        <View className="flex-1 p-4 mt-[4rem]">
            <View className="flex-row items-center justify-between mb-6">
                <Button title="Back" onPress={() => navigation.goBack()} color={'black'}/>
                <Text className="text-2xl font-bold text-gray-800 flex-1 text-center">Assign Athletes</Text>
                <View className="w-16" />
            </View>
            <View className="space-y-3">
            {athletes.map(athlete => (
                <View key={athlete[0]} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-row items-center justify-between">
                    <Text className="text-lg font-medium text-gray-800 flex-1">{athlete[1]}</Text>
                    {athlete[2] ? 
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                            <Text className="text-green-800 font-medium">Assigned</Text>
                        </View> : 
                        <View className="bg-blue-500 px-4 py-2 rounded-lg">
                            <Button title="Assign" onPress={() => handleAssignAthlete(athlete[0])} />
                        </View>
                    }
                </View>
            ))}
            </View>
        </View>
    );
}

export default AssignAthletes;