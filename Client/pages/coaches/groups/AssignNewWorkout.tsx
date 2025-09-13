import { useNavigation, useRoute } from "@react-navigation/native";
import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";
import CoachWorkoutService from "../../../services/CoachWorkoutService";

const AssignNewWorkout = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { groupId, groupName, workout } = route.params as { groupId: string, groupName: string, workout?: any };

    console.log(workout)
    const handleWorkoutCreation = async (workoutData:any) => {
        const resp = await CoachWorkoutService.assignGroupWorkout(groupId, workoutData);
        if(resp.ok) {
            navigation.navigate("ViewGroupCoach", { groupId: groupId, groupName: groupName });
        }
    }

    return (
        <WorkoutCreation
            workout={workout}
            pageTitle="Assign Group Workout"
            buttonText="Assign"
            handleWorkoutCreation={handleWorkoutCreation}
        />
    );
}

export default AssignNewWorkout;