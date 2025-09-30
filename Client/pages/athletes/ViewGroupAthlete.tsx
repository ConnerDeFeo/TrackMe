import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import DisplayWorkout from "../../components/display/DisplayWorkout";
import GeneralService from "../../services/GeneralService";

//Pages that displays an athletes groupp for a given date
const ViewGroupAthlete = ()=>{
    const route = useRoute();
    const { groupName, groupId } = route.params as { groupName: string, groupId: string } || {};
    const [workouts, setWorkouts] = useState<Array<any>>([]);
    const [athletes, setAthletes] = useState<string[]>([]);

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
            {workouts.map((workout) => (
                <DisplayWorkout key={workout.groupWorkoutId} workout={workout} onPress={() => {}} />
            ))}
            <Text className="text-2xl font-bold mt-2 mb-4">Athletes</Text>
            <View className="gap-y-2">
                {athletes.map((athlete, index) => (
                    <Text key={index} className="text-lg font-medium text-gray-800 rounded-lg p-3 border border-red-500">{athlete[1]}</Text>
                ))}
            </View>
        </View>
    );
}

export default ViewGroupAthlete;