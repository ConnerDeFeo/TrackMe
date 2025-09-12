import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import { useNavigation, useRoute } from "@react-navigation/native";
import WorkoutCreation from "../../../components/coaches/workouts/WorkoutCreation";

//Page for workout creation by coaches
const CreateWorkout = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { workout, isEdit } = (route.params as { workout?: any, isEdit: boolean }) || {};

  const handleWorkoutCreation = async (workoutData:any) => {
    const coachId = await UserService.getUserId();
    workoutData['coachId'] = coachId;
    const resp = await CoachWorkoutService.createWorkoutTemplate(workoutData);
    if (resp.ok){
      navigation.navigate('WorkoutTemplates');
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