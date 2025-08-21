import { useEffect, useState } from "react";
import { Text,ScrollView, View, TextInput, TouchableOpacity } from "react-native";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";
import GeneralService from "../../services/GeneralService";

//Page where athletes input times
const Inputs = ()=>{
    const [groups,setGroups] = useState<string[][]>([]);
    const [workoutInputs, setWorkoutInputs] = useState<Record<string, any>>({});

    // Track current input values for each given group { groupId : time/distance }
    const [currentTime, setCurrentTime] = useState<Record<string, number | undefined>>({});
    const [currentDistance, setCurrentDistance] = useState<Record<string, number | undefined>>({});

    // Grab all current inputs on load
    useEffect(()=>{
        const fetchWorkoutInputs = async () => {
            const resp = await AthleteWorkoutService.viewWorkoutInputs();
            if (resp.ok){
                const data = await resp.json();
                setWorkoutInputs(data);
            }
        };
        const fetchGroups = async () => {
            const resp = await GeneralService.getGroups();
            if (resp.ok){
                const groups = await resp.json();
                setGroups(groups);
            }
        };
        fetchWorkoutInputs();
        fetchGroups();
    },[]);

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="mt-16 px-6 pb-8">
                <Text className="text-2xl font-bold text-gray-800 mb-6">Inputs</Text>
                {groups.map(group => (
                    <View key={group[1]} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-4">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-lg font-semibold text-gray-700">{group[0]}</Text>
                            <TouchableOpacity>
                                <Text className="text-[#E63946] underline">Create Group</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex flex-row justify-between items-center">
                            <TextInput placeholder="Enter time"/>
                            <TextInput placeholder="Enter distance"/>
                            <Text>Meters</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default Inputs;