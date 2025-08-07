import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import CoachService from "../../../services/CoachService";
import UserService from "../../../services/UserService";

//Page where coaches can add any current athletes to a given group
const AssignAthletes = ()=>{
    const [athletes, setAthletes] = useState<string[]>([]);

    //Fetch all athletes on load
    useEffect(()=>{
        const fetchAthletes = async () => {
            const userId = await UserService.getUserId();
            const response = await CoachService.getAthletes(userId!);
            if (response.ok) {
                const data = await response.json();
                setAthletes(data);
            }
        }
        fetchAthletes();
    }, []);

    return (
        <View>
            <Text className="font-bold text-center mb-5">Assign Athletes</Text>
            {athletes.map(athlete => (
                <View key={athlete[0]}>
                    <Text>{athlete[1]}</Text>
                    <Button title="assign"/>
                </View>
            ))}
        </View>
    );
}

export default AssignAthletes;