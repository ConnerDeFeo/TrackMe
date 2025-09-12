import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import UserService from "../../../services/UserService";
import DisplayWorkout from "../../../components/DisplayWorkout";

const Workouts = () => {
  const navigation = useNavigation<any>();

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
    <ScrollView className="mt-[4rem]">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-4xl font-bold">Workouts</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateWorkout', {isEdit: false})}>
          <Image source={require("../../../images/Add.png")} className="h-12 w-12 rounded-full border-3" />
        </TouchableOpacity>
      </View>
      {workouts.map((workout, idx) => {
        return (
          <DisplayWorkout key={idx} workout={workout} onRemove={onRemove} onPress={() => navigation.navigate('CreateWorkout', { workout: workout, isEdit: true })} />
        );
      })}
    </ScrollView>
  );
};

export default Workouts;
