import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import { useNavigation } from "@react-navigation/native";
import NavigationContainer from "../../../common/components/display/NavigationContainer";
import Workout from "../../../common/types/workouts/Workout";
import ArrowButton from "../../../common/components/ArrowButton";
const WorkoutTemplates = () => {
  const navigation = useNavigation<any>();
  // State to store fetched workout templates
  const [workouts, setWorkouts] = useState<Array<Workout>>([]);

  // On mount, fetch all workout templates from the service
  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await CoachWorkoutService.getWorkoutTemplates();
      if (response.ok) {
        // Parse JSON and update state
        const data = await response.json();
        setWorkouts(data || []);
      }
    }

    fetchWorkouts();
  }, []);

  // Render a scrollable list of DisplayWorkout components
  return (
    <View className="mb-2 gap-y-4">
      {workouts.map((workout) => (
        <Pressable 
          key={workout.workoutId} 
          onPress={() => navigation.navigate("CreateWorkoutTemplate", { workoutId: workout.workoutId })}
          className="border-b bg-gray-100 rounded-lg flex flex-row justify-between items-center p-4"
        >
          <Text className="font-semibold text-sm my-2">{workout.title}</Text>
          <ArrowButton onPress={() => navigation.navigate("CreateWorkoutTemplate", { workoutId: workout.workoutId })}/>
        </Pressable>
      ))}
    </View>
  )
}

export default WorkoutTemplates;
