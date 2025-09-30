import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNavigation, useRoute } from "@react-navigation/native";

// Component to assign a new workout to a coach's group
const AssignNewWorkout = () => {
    // Retrieve navigation and route helpers from React Navigation
    const route = useRoute();
    const navigation = useNavigation<any>();

    // Destructure route parameters passed from the previous screen
    const {
        groupId,    // ID of the group to assign the workout
        groupName,  // Name of the group (for navigation)
        workout,    // Optional existing workout to prefill form
        date        // The date for which the workout is scheduled
    } = route.params as {
        groupId: string;
        groupName: string;
        workout?: any;
        date: string;
    };

    // Handler called when the workout form is submitted
    const handleWorkoutCreation = async (workoutData: any) => {
        // Call service to assign the workout to the group on the given date
        const resp = await CoachWorkoutService.assignGroupWorkout(
            groupId,
            workoutData,
            date
        );

        // If assignment succeeds, navigate back to the group overview
        if (resp.ok) {
            navigation.popTo("GroupSchedule", { groupId, groupName });
        }
    };

    return (
        // Render the workout creation form
        <WorkoutCreation
            buttonText="Assign"
            handleWorkoutCreation={handleWorkoutCreation}
            workout={workout}
        />
    );
};

export default AssignNewWorkout;