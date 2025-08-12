import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";
import DisplayWorkout from "../../../components/DisplayWorkout";
import TrackMeButton from "../../../components/TrackMeButton";

//Page where coaches can assign workouts to athletes
const AssignWorkout = ()=>{
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { groupId } = route.params as { groupId: string };
    const [workouts, setWorkouts] = useState<Array<any>>([]);

    //Fetch all workouts
    useEffect(() => {
        const fetchWorkouts = async () => {
        const coachId = await UserService.getUserId();
        const response = await CoachWorkoutService.getWorkouts(coachId!);
        if(response.ok) {
            const workouts = await response.json();
            setWorkouts(workouts['Items'] || []);
        }
        };

        fetchWorkouts();
    }, []);

    const handleAssignWorkout = async (workoutId:string) => {
        const coachId = await UserService.getUserId();
        const response = await CoachWorkoutService.assignWorkoutToGroup(workoutId, coachId!, groupId);
        if (response.ok) {
            navigation.goBack();
        }
    };

    return (
        <View>
            <Text>Assign Workout</Text>
            {workouts.map((workout, idx) => (
                <View key={idx} className="my-2">
                    <DisplayWorkout workout={workout} />
                    <TrackMeButton title="Assign" onPress={() => handleAssignWorkout(workout.workout_id)} />
                </View>
            ))}
        </View>
    );
}

export default AssignWorkout;