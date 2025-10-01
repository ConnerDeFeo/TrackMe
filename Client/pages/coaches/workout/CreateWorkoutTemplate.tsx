import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNavigation, useRoute } from "@react-navigation/native";
import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";

//Page for workout creation by coaches
const CreateWorkout = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { workout } = (route.params as { workout?: any }) || {};

  const handleWorkoutCreation = async (workoutData:any) => {
    const resp = await CoachWorkoutService.createWorkoutTemplate(workoutData);
    if (resp.ok){
      navigation.reset({
        index: 0,
        routes: [{ name: 'WorkoutTemplates' }],
      });
    } 
  };

  const handleWorkoutDeletion = async () => {
    if (!workout?.workoutId) return;
    const resp = await CoachWorkoutService.deleteWorkoutTemplate(workout.workoutId);
    if (resp.ok) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'WorkoutTemplates' }],
      });
    }
  };

  return (
    <WorkoutCreation
      workout={workout}
      handleWorkoutCreation={handleWorkoutCreation}
      buttonText={workout ? "Save Changes" : "Create Workout"}
      onRemove={workout ? handleWorkoutDeletion : undefined}
    />
  );
};

export default CreateWorkout;