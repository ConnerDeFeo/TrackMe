import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import CoachGroupService from "../../../services/CoachGroupService";
import { useNavigation, useRoute } from "@react-navigation/native";
import UserService from "../../../services/UserService";
import TrackMeButton from "../../../components/TrackMeButton";

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
        <View>
            <View>
                <TrackMeButton title="Back" onPress={() => navigation.goBack()}/>
                <Text className="font-bold text-center mb-5">Assign Athletes</Text>
            </View>
            {athletes.map(athlete => (
                <View key={athlete[0]}>
                    <Text>{athlete[1]}</Text>
                    {athlete[2] ? <Text>Assigned</Text> : <TrackMeButton title="Assign" onPress={() => handleAssignAthlete(athlete[0])} />}
                </View>
            ))}
        </View>
    );
}

export default AssignAthletes;