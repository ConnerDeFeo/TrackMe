import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import DisplayWorkout from "../../../components/DisplayWorkout";
import { useNavigation } from "@react-navigation/native";

const WorkoutTemplates = () => {
  const navigation = useNavigation<any>();
  const [workouts, setWorkouts] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const coachId = await UserService.getUserId();
      const response = await CoachWorkoutService.getWorkoutTemplates();
      if(response.ok) {
        const workouts = await response.json();
        setWorkouts(workouts || []);
      }
    };

    fetchWorkouts();
  }, []);

  const onRemove = async (workoutId: string) => {
    const resp = await CoachWorkoutService.deleteWorkoutTemplate(workoutId);
    if (resp.ok) {
      setWorkouts(workouts.filter(workout => workout.workoutId !== workoutId));
    }
  };

  return (
    <ScrollView>
      {workouts.map((workout, idx) => {
        return (
          <DisplayWorkout key={idx} workout={workout} onRemove={onRemove} onPress={() => navigation.navigate('CreateWorkoutTemplate', { workout: workout, isEdit: true })} />
        );
      })}
    </ScrollView>
  );
};

export default WorkoutTemplates;
