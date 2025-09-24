import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNav } from "../../../hooks/useNav";
import { useRoute } from "@react-navigation/native";

const AssignNewWorkout = () => {
    const route = useRoute();
    const { navigate } = useNav();
    const { groupId, groupName, workout } = route.params as { groupId: string, groupName: string, workout?: any };

    const handleWorkoutCreation = async (workoutData:any) => {
        const resp = await CoachWorkoutService.assignGroupWorkout(groupId, workoutData);
        if(resp.ok) {
            navigate("ViewGroupCoach", { groupId, groupName });
        }
    }
    console.log("workout", workout);
    return (
        <WorkoutCreation
            buttonText="Assign"
            handleWorkoutCreation={handleWorkoutCreation}
            workout={workout}
        />
    );
}

export default AssignNewWorkout;