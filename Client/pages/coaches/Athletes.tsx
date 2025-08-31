import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useEffect } from "react";
import CoachService from "../../services/CoachService";
import { useNavigation } from "@react-navigation/native";
import UserService from "../../services/UserService";
import CoachAthleteRelationship from "../../components/CoachAthleteRelationship";

//All of a given coach's athletes
const Athletes = () => {
    const [athletes, setAthletes] = useState<string[][]>([]);
    const navigation = useNavigation<any>();

    const fetchAthletes = async () => {
            try {
                const userId = await UserService.getUserId();
                const resp = await CoachService.getAthletes(userId!);
                if(resp.ok){
                    const athletes: string[][] = await resp.json()
                    setAthletes(athletes);
                }
            } catch (error) {
                console.error("Failed to fetch athletes:", error);
            }
        };

    //Fetch athletes for the current coach
    useEffect(() => {
        fetchAthletes();
    }, []);

    return (
        <ScrollView className="flex-1 p-4 mt-[4rem]">
            <Text className="text-4xl font-bold">My Athletes</Text>
            <View className="my-6 flex flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => navigation.navigate("AthleteRequests", {fetchAthletes:fetchAthletes})}
                >
                    <Text className="text-[#E63946] font-semibold underline">Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("AddAthlete")}
                >
                    <Text className="text-[#E63946] font-semibold underline">Add Athlete</Text>
                </TouchableOpacity>
            </View>
            
            <View className="gap-y-3">
                {athletes.map((athlete) => (
                    <CoachAthleteRelationship key={athlete[0]} user={athlete} fetchUsers={fetchAthletes} />
                ))}
            </View>
        </ScrollView>
    );
}

export default Athletes;