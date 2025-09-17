import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useRoute } from "@react-navigation/native";
import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";
import { useNav } from "../../../hooks/useNav";

//Page for workout creation by coaches
const CreateWorkout = () => {
  const { replace } = useNav();
  const route = useRoute();
  const { workout, isEdit } = (route.params as { workout?: any, isEdit: boolean }) || {};

  const handleWorkoutCreation = async (workoutData:any) => {
    const coachId = await UserService.getUserId();
    workoutData['coachId'] = coachId;
    const resp = await CoachWorkoutService.createWorkoutTemplate(workoutData);
    if (resp.ok){
      replace('WorkoutTemplates');
    } 
  };
  return (
    <WorkoutCreation
      workout={workout}
      handleWorkoutCreation={handleWorkoutCreation}
      pageTitle={"Create Workout Template"}
      buttonText={isEdit ? "Save Changes" : "Create Workout"} 
    />
  );
};

export default CreateWorkout;