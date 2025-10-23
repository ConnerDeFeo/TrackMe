import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNavigation, useRoute } from "@react-navigation/native";
import WorkoutCreation from "../../../common/components/coaches/workouts/WorkoutCreation";

//Page for workout creation by coaches
const CreateWorkout = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { workoutId } = (route.params as { workoutId?: string }) || {};

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
    if (!workoutId) return;
    const resp = await CoachWorkoutService.deleteWorkoutTemplate(workoutId);
    if (resp.ok) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'WorkoutTemplates' }],
      });
    }
  };

  return (
    <WorkoutCreation
      workoutId={workoutId}
      handleWorkoutCreation={handleWorkoutCreation}
      buttonText={workoutId ? "Save Changes" : "Create Workout"}
      onRemove={workoutId ? handleWorkoutDeletion : undefined}
    />
  );
};

export default CreateWorkout;