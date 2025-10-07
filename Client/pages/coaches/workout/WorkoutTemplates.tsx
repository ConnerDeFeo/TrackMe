import { useEffect, useState } from "react";
import { View } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import DisplayWorkout from "../../../common/components/display/DisplayWorkout";
import { useNavigation } from "@react-navigation/native";
const WorkoutTemplates = () => {
  // Hook to navigate between screens
  const navigation = useNavigation<any>()

  // State to store fetched workout templates
  const [workouts, setWorkouts] = useState<Array<any>>([])

  // On mount, fetch all workout templates from the service
  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await CoachWorkoutService.getWorkoutTemplates()
      if (response.ok) {
        // Parse JSON and update state
        const data = await response.json()
        setWorkouts(data || [])
      }
    }

    fetchWorkouts()
  }, [])
  // Render a scrollable list of DisplayWorkout components
  return (
    <View className="mx-2 my-4 gap-y-4">
      {workouts.map((workout, idx) => (
        <DisplayWorkout
          key={idx}
          workout={workout}
          onPress={() =>
            navigation.navigate('CreateWorkoutTemplate', {workout})
          }
        />
      ))}
    </View>
  )
}

export default WorkoutTemplates;
