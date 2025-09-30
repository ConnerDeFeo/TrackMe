import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import CoachWorkoutService from "../../../services/CoachWorkoutService";
import DisplayWorkout from "../../../components/display/DisplayWorkout";
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

  // Handler to delete a workout template
  const onRemove = async (workoutId: string) => {
    const resp = await CoachWorkoutService.deleteWorkoutTemplate(workoutId)
    if (resp.ok) {
      // Remove deleted template from local state
      setWorkouts(prev => prev.filter(w => w.workoutId !== workoutId))
    }
  }

  // Render a scrollable list of DisplayWorkout components
  return (
    <ScrollView>
      {workouts.map((workout, idx) => (
        <DisplayWorkout
          key={idx}
          workout={workout}
          onRemove={onRemove}
          onPress={() =>
            navigation.navigate('CreateWorkoutTemplate', {
              workout,
              isEdit: true,
            })
          }
        />
      ))}
    </ScrollView>
  )
}

export default WorkoutTemplates;
