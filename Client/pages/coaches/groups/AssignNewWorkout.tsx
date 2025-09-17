import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNav } from "../../../hooks/useNav";
import { useRoute } from "@react-navigation/native";

const AssignNewWorkout = () => {
    const route = useRoute();
    const { navigate } = useNav();
    const { groupId, groupName } = route.params as { groupId: string, groupName: string };

    const handleWorkoutCreation = async (workoutData:any) => {
        const resp = await CoachWorkoutService.assignGroupWorkout(groupId, workoutData);
        if(resp.ok) {
            navigate("ViewGroupCoach", { groupId: groupId, groupName: groupName });
        }
    }

    return (
        <WorkoutCreation
            pageTitle="Assign Group Workout"
            buttonText="Assign"
            handleWorkoutCreation={handleWorkoutCreation}
        />
    );
}

export default AssignNewWorkout;