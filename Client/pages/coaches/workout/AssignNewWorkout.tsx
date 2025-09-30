import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNavigation, useRoute } from "@react-navigation/native";

const AssignNewWorkout = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { groupId, groupName, workout, date } = route.params as { groupId: string, groupName: string, workout?: any, date: string };

    const handleWorkoutCreation = async (workoutData:any) => {
        const resp = await CoachWorkoutService.assignGroupWorkout(groupId, workoutData, date);
        if(resp.ok) {
            navigation.popTo("ViewGroupCoach", { groupId, groupName });
        }
    }
    return (
        <WorkoutCreation
            buttonText="Assign"
            handleWorkoutCreation={handleWorkoutCreation}
            workout={workout}
        />
    );
}

export default AssignNewWorkout;