import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AthleteService from "../../services/AthleteService";
import CoachAthleteRelationship from "../../components/CoachAthleteRelationship";
import GeneralService from "../../services/GeneralService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

//Shows current coaches and current coach requests to athletes
const Coaches = ()=>{
    const [coaches, setCoaches] = useState<string[][]>([]);
    const [invites, setInvites] = useState<number>(0);
    const navigation = useNavigation<any>();

    const fetchInvites = async () => {
        const resp = await GeneralService.getPendingProposals();
        if (resp.ok) {
            const invites = await resp.json();
            setInvites(invites.count);
        }
    };

    //Fetches all current coaches for a given user
    const fetchCoaches = useCallback(async () => {
        const requestsResponse = await AthleteService.getCoaches();
        if (requestsResponse.ok) {
            const data = await requestsResponse.json();
            setCoaches(data);
        }
        else{
            setCoaches([])
        }
        fetchInvites();
    }, []);

    //Fetch all requests on load
    useFocusEffect(useCallback(() => {
        fetchCoaches();
    }, [fetchCoaches]));

    return (
        <View className="flex-1 px-4 mt-4">
            <View className="flex flex-row justify-between items-center">
                <TouchableOpacity onPress={() => navigation.navigate('CoachInvites')}>
                    <Text className="trackme-blue font-semibold">Invites({invites})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('RequestCoaches')}>
                    <Text className="trackme-blue font-semibold">Add Coaches</Text>
                </TouchableOpacity>
            </View>
            <View className="bg-white rounded-lg p-4 mb-6">
            {coaches.length > 0 ? (
                coaches.map(coach => (
                    <CoachAthleteRelationship key={coach[0]} user={coach} fetchUsers={fetchCoaches} />
                ))
            ) : (
                <Text className="text-gray-500 text-center py-4">No coaches yet</Text>
            )}
            </View>
        </View>
    )
}

export default Coaches;