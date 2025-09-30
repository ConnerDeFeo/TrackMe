import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import DisplayWorkout from "../../components/display/DisplayWorkout";
import GeneralService from "../../services/GeneralService";
import UserDisplay from "../../components/display/UserDisplay";

//Pages that displays an athletes groupp for a given date
const ViewGroupAthlete = ()=>{
    const route = useRoute();
    const { groupName, groupId } = route.params as { groupName: string, groupId: string } || {};
    const [workouts, setWorkouts] = useState<Array<any>>([]);
    const [athletes, setAthletes] = useState<string[]>([]);
    const navigation = useNavigation<any>();

    useEffect(() => {
        // Fetch workout data for the group
        const fetchWorkout = async () => {
            const resp = await GeneralService.getGroupWorkout(groupId);
            if (resp.ok) {
                const workouts = await resp.json();
                setWorkouts(workouts);
            }
        };
        const fetchAthletes = async ()=>{
            const resp = await GeneralService.getAthletesForGroup(groupId);
            if (resp.ok) {
                const data = await resp.json();
                setAthletes(data);
            }
        };
        fetchAthletes();
        fetchWorkout();
    }, [groupId]);
    return(
        <View className="px-4">
            <Pressable
                onPress={() =>
                    navigation.navigate('GroupSchedule', { groupId, groupName })
                }
                className="rounded-lg py-3 px-4"
            >
                <Text className="trackme-blue font-semibold">
                    Schedule
                </Text>
            </Pressable>
            {workouts.map((workout) => (
                <DisplayWorkout key={workout.groupWorkoutId} workout={workout} onPress={() => {}} />
            ))}
            <Text className="text-2xl font-bold mt-2 mb-4">Athletes</Text>
            <View className="gap-y-2">
                {athletes.map((athlete) => (
                    <UserDisplay key={athlete[0]} username={athlete[1]} firstName={athlete[2]} lastName={athlete[3]} className="mb-2 border border-gray-300 rounded-lg p-2" />
                ))}
            </View>
        </View>
    );
}

export default ViewGroupAthlete;