import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";
import DisplayWorkout from "../../../components/DisplayWorkout";

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

    const handleAssignWorkout = async (title:string) => {
        const coachId = await UserService.getUserId();
        const response = await CoachWorkoutService.assignWorkoutToGroup(title, coachId!, groupId);
        if (response.ok) {
            navigation.goBack();
        }
    };

    return (
        <View>
            <Text>Assign Workout</Text>
            {workouts.map((workout, idx) => (
                <TouchableOpacity key={idx} className="border my-2" onPress={() => handleAssignWorkout(workout.title)}>
                    <DisplayWorkout workout={workout} />
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default AssignWorkout;