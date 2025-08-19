import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
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
        console.log(workouts)
        setWorkouts(workouts['Items'] || []);
      }
    };

    fetchWorkouts();
  }, []);

  const onRemove = async (workoutId: string) => {
    const coachId = await UserService.getUserId();
    const resp = await CoachWorkoutService.deleteWorkout(workoutId, coachId!);
    if (resp.ok) {
      setWorkouts(workouts.filter(workout => workout.workout_id !== workoutId));
    }
  };

  return (
    <ScrollView className="mt-[4rem]">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-4xl font-bold">Workouts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateWorkout')}>
          <Image source={require("../../../images/Add.png")} className="h-12 w-12 rounded-full border-3" />
        </TouchableOpacity>
      </View>
      {workouts.map((workout, idx) => (
        <DisplayWorkout key={idx} workout={workout} onRemove={onRemove} />
      ))}
    </ScrollView>
  );
};

export default Workouts;
