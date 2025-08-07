import { useState } from "react";
import { View, Text, Button } from "react-native"
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
        <View>
            <Button
                title="Add Athlete"
                onPress={() => navigation.navigate("AddAthlete")}
            />
            {athletes.map((athlete) => (
                <View key={athlete[1]}>
                    <Text>{athlete[0]}</Text>
                </View>
            ))}
        </View>
    );
}

export default Athletes;