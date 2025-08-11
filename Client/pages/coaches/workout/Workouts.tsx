import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, Text, View, ScrollView } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import DisplayWorkout from "../../../components/DisplayWorkout";

const Workouts = () => {
  const navigation = useNavigation<any>();

  const [workouts, setWorkouts] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const coachId = await UserService.getUserId();
      const response = await CoachWorkoutService.getWorkouts(coachId!);
      if(response.ok) {
        const workouts = await response.json();
        setWorkouts(workouts['Items'] || []);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <ScrollView>
      <Text>Workouts</Text>
      {workouts.map((workout, idx) => (
        <DisplayWorkout key={idx} workout={workout} />
      ))}
      <Button title="Create Workout" onPress={() => navigation.navigate('CreateWorkout')}/>
    </ScrollView>
  );
};

export default Workouts;
