import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AthleteService from "../../services/AthleteService";
import UserService from "../../services/UserService";
import { useNavigation } from "@react-navigation/native";
import CoachAthleteRelationship from "../../components/CoachAthleteRelationship";

//Shows current coaches and current coach requests to athletes
const Coaches = ()=>{
    const [userId, setUserId] = useState<string>('');
    const [coaches, setCoaches] = useState<string[][]>([]);
    const navigation = useNavigation<any>();

    //Fetches all current coaches for a given user
    const fetchCoaches = async () => {
        const requestsResponse = await AthleteService.getCoaches(userId);
        if (requestsResponse.ok) {
            const data = await requestsResponse.json();
            setCoaches(data);
        }
        else{
            setCoaches([])
        }
    }

    //Fetch all requests on load
    useEffect(() => {
        const fetchData = async () => {
            const userId = await UserService.getUserId();
            if(userId){
                setUserId(userId);
            }    
            fetchCoaches();
        }
        fetchData();
    }, [userId]); //userId needed in case of page switching back and forth

    return (
        <View className="flex-1 px-6 py-8 mt-[4rem]">
            <Text className="text-4xl font-bold">Coaches</Text>
            <View className="my-6 flex flex-row justify-between items-center">
                <TouchableOpacity onPress={() => navigation.navigate('CoachRequests',{fetchCoaches:fetchCoaches})}>
                    <Text className="text-[#E63946] font-semibold underline">Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('RequestCoaches')}>
                    <Text className="text-[#E63946] font-semibold underline">Add Coaches</Text>
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