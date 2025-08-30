import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useEffect } from "react";
import CoachService from "../../services/CoachService";
import { useNavigation } from "@react-navigation/native";
import UserService from "../../services/UserService";

//All of a given coach's athletes
const Athletes = () => {
    const [athletes, setAthletes] = useState<string[][]>([]);
    const navigation = useNavigation<any>();

    //Fetch athletes for the current coach
    useEffect(() => {
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
        fetchAthletes();
    }, []);

    return (
        <ScrollView className="flex-1 p-4 mt-[4rem]">
            <Text className="text-4xl font-bold">My Athletes</Text>
            <View className="my-6 flex flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => navigation.navigate("AthleteRequests")}
                >
                    <Text className="text-[#E63946] font-semibold underline">Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("AddAthlete")}
                >
                    <Text className="text-[#E63946] font-semibold underline">Add Athlete</Text>
                </TouchableOpacity>
            </View>
            
            <View className="space-y-3">
                {athletes.map((athlete) => (
                    <View key={athlete[0]} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <Text className="text-lg font-medium">{athlete[1]}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default Athletes;