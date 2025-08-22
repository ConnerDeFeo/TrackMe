import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import DisplayWorkout from "../../components/DisplayWorkout";
import AthleteWorkoutService from "../../services/AthleteWorkoutService";

//Pages that displays an athletes groupp for a given date
const ViewGroupAthlete = ()=>{
    const route = useRoute();
    const { groupName, groupId } = route.params as { groupName: string, groupId: string } || {};
    const [workouts, setWorkouts] = useState<Array<any>>([]);

    useEffect(() => {
        // Fetch workout data for the group
        const fetchWorkout = async () => {
            const resp = await AthleteWorkoutService.viewWorkouts(groupId);
            if (resp.ok) {
                const workouts = await resp.json();
                setWorkouts(workouts);
            }
        };

        fetchWorkout();
    }, [groupId]);

    return(
        <View className="mt-[4rem]">
            <Text className="text-2xl font-bold text-center">{groupName}</Text>
            {workouts.map((workout) => (
                <DisplayWorkout key={workout.workoutId} workout={workout} onPress={() => {}} />
            ))}
        </View>
    );
}

export default ViewGroupAthlete;