import { useNavigation, useRoute } from "@react-navigation/native";
import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";
import CoachGroupService from "../../../services/CoachGroupService";

const AssignNewWorkout = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();
    const { groupId, groupName } = route.params as { groupId: string, groupName: string };

    const handleWorkoutCreation = async (workoutData:any) => {
        const resp = await CoachGroupService.assignGroupWorkout(groupId, workoutData);
        if(resp.ok) {
            navigation.navigate("ViewGroupCoach", { groupId: groupId, groupName: groupName });
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