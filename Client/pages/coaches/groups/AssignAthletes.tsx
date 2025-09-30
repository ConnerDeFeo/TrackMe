import { useCallback, useEffect, useState } from "react";
import {Text, Pressable, View } from "react-native";
import CoachGroupService from "../../../services/CoachGroupService";
import { useRoute } from "@react-navigation/native";
import GeneralService from "../../../services/GeneralService";

//Page where coaches can add any current athletes to a given group
const AssignAthletes = ()=>{
    const [athletes, setAthletes] = useState<string[]>([]);
    const [absentAthletes, setAbsentAthletes] = useState<string[]>([]);
    const [stateChanged, setStateChanged] = useState<boolean>(true);

    const route = useRoute();
    const { groupId } = route.params as { groupId: string};


    /**
     * Fetches all athletes in the current group from the server
     * and updates the `participants` state.
     */
    const fetchGroupAthletes = useCallback(async () => {
        const resp = await GeneralService.getAthletesForGroup(groupId);
        if (resp.ok) {
        const data = await resp.json();
            setAthletes(data);
        } else {
        // Clear participants if the request fails
            setAthletes([]);
        }
    }, [groupId]);

    const fetchAbsentAthletes = async () => {
            const response = await CoachGroupService.getAbsentGroupAthletes(groupId);
            if (response.ok) {
                const data = await response.json();
                setAbsentAthletes(data);
            }
            else{
                setAbsentAthletes([]);
            }
        }

    /**
     * Removes a single athlete from the group on the server,
     * then refreshes the participants list.
     */
    const removeAthleteFromGroup = async (athleteId: string) => {
        const resp = await CoachGroupService.removeAthleteFromGroup(athleteId, groupId);
        if (resp.ok) {
            setStateChanged(true);
        }
    };

    //Fetch all athletes on load
    useEffect(()=>{
        if(stateChanged){
            fetchAbsentAthletes();
            fetchGroupAthletes();
            setStateChanged(false);
        }
    }, [stateChanged]);

    //Handle assigning athletes to given groups
    async function handleAssignAthlete(athleteId: string){
        const response = await CoachGroupService.add_athlete_to_group(athleteId, groupId);
        if (response.ok) {
            setStateChanged(true);
        }
    };

    return (
        <View className="flex-1 mt-4">
            {athletes.map(athlete => (
                <View key={athlete[0]} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-row items-center justify-between mb-4">
                    <Text className="text-lg font-medium text-gray-800 flex-1">{athlete[1]}</Text>
                    <Pressable className="trackme-bg-red px-4 py-2 rounded-lg" onPress={() => removeAthleteFromGroup(athlete[0])}>
                        <Text className="text-white font-semibold">Remove</Text>
                    </Pressable>
                </View>
            ))}
            {absentAthletes.map(athlete => (
                <View key={athlete[0]} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-row items-center justify-between">
                    <Text className="text-lg font-medium text-gray-800 flex-1">{athlete[1]}</Text>
                    <Pressable className="trackme-bg-blue px-4 py-2 rounded-lg" onPress={() => handleAssignAthlete(athlete[0])}>
                        <Text className="text-white font-semibold">Assign</Text>
                    </Pressable>
                </View>
            ))}
        </View>
    );
}

export default AssignAthletes;