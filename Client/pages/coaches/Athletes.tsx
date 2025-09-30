import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native"
import { useEffect } from "react";
import CoachService from "../../services/CoachService";
import CoachAthleteRelationship from "../../components/CoachAthleteRelationship";
import GeneralService from "../../services/GeneralService";
import { useNavigation } from "@react-navigation/native";

//All of a given coach's athletes
const Athletes = () => {
    const [athletes, setAthletes] = useState<string[][]>([]);
    const [requests, setRequests] = useState<number>(0);
    const navigation = useNavigation<any>();

    const fetchRequests = async () => {
        const resp = await GeneralService.getPendingProposals();
        if(resp.ok){
            const requests = await resp.json();
            setRequests(requests.count);
        }
    };

    const fetchAthletes = async () => {
        try {
            const resp = await CoachService.getAthletes();
            if(resp.ok){
                const athletes: string[][] = await resp.json()
                setAthletes(athletes);
            }
        } catch (error) {
            setAthletes([]);
        }
        fetchRequests(); // Also fetch requests when fetching athletes
    };

    //Fetch athletes for the current coach
    useEffect(() => {
        fetchAthletes();
    }, []);

    return (
        <View className="flex-1 px-4 mt-4">
            <View className="mb-6 flex flex-row justify-between items-center">
                <TouchableOpacity onPress={() => navigation.navigate("AthleteRequests", {fetchAthletes:fetchAthletes})}>
                    <Text className="trackme-blue font-semibold">Requests({requests})</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("AddAthlete")}>
                    <Text className="trackme-blue font-semibold">Add Athlete</Text>
                </TouchableOpacity>
            </View>
            
            <View className="gap-y-3">
                {athletes.map((athlete) => (
                    <CoachAthleteRelationship key={athlete[0]} user={athlete} fetchUsers={fetchAthletes} />
                ))}
            </View>
        </View>
    );
}

export default Athletes;