import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import DisplayWorkout from "../../../components/DisplayWorkout";
import PageHeading from "../../../components/PageHeading";
import { useNav } from "../../../hooks/useNav";

const WorkoutTemplates = () => {
  const { navigate } = useNav();

  const [workouts, setWorkouts] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const coachId = await UserService.getUserId();
      const response = await CoachWorkoutService.getWorkoutTemplates(coachId!);
      if(response.ok) {
        const workouts = await response.json();
        setWorkouts(workouts || []);
      }
    };

    fetchWorkouts();
  }, []);

  const onRemove = async (workoutId: string) => {
    const coachId = await UserService.getUserId();
    const resp = await CoachWorkoutService.deleteWorkoutTemplate(workoutId, coachId!);
    if (resp.ok) {
      setWorkouts(workouts.filter(workout => workout.workoutId !== workoutId));
    }
  };

  return (
    <>
      <PageHeading title="Workout Templates" addFunction={() => navigate('CreateWorkoutTemplate')} />
      <ScrollView>
        {workouts.map((workout, idx) => {
          return (
            <DisplayWorkout key={idx} workout={workout} onRemove={onRemove} onPress={() => navigate('CreateWorkoutTemplate', { workout: workout, isEdit: true })} />
          );
        })}
      </ScrollView>
    </>
  );
};

export default WorkoutTemplates;
