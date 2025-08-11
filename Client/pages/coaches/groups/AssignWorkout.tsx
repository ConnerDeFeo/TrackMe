import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useRoute } from "@react-navigation/native";

//Page where coaches can assign workouts to athletes
const AssignWorkout = ()=>{
    const route = useRoute();
    const { groupId, groupName } = route.params as { groupId: string, groupName: string };
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
        const response = await CoachWorkoutService.assignWorkoutToGroup(title, coachId!, groupName);
        if (response.ok) {
            // Handle successful assignment
        }
    };

    return (
        <View>
            <Text>Assign Workout</Text>
            {workouts.map((workout, idx) => (
                <Text key={idx} className="border my-2">{workout.title}</Text>
            ))}
        </View>
    );
}

export default AssignWorkout;